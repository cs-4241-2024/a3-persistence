const express = require("express"),
  { MongoClient, ObjectId } = require("mongodb"),
  app = express();

app.use(express.static('public'));
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
const client = new MongoClient(uri);

let collection = null;

async function run() {
  await client.connect();
  collection = await client.db("A3").collection("toDoData");
  
  // route to get all docs
  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json( docs )
    }
  })
}
run();

app.use((req, res, next) => {
  if (collection !== null) {
    next();
  } else {
    res.status(503).send();
  }
});

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});


app.post("/add", async (req, res) => {
  try {
    const result = await collection.insertOne(req.body);
    res.json(result);
  } catch (error) {
    console.error("Error adding document:", error);
    res.status(500).send("Error adding document.");
  }
});

app.delete( '/remove/:id', async (req,res) => {
  const result = await collection.deleteOne({ 
    _id:new ObjectId(req.params.id) 
  })
  res.json( result )
})

app.put( '/update/:id', async (req,res) => {
  const result = await collection.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: req.body }
  )

  res.json( result )
})


app.listen(process.env.PORT || 3000);