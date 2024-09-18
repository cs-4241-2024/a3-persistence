const express = require("express"),
  app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.listen(process.env.PORT || 3000);

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://tester:Ko6JvUDNawYeyBWk@cluster0.t681i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    app.get("/highscores", async (req, res) => {
      if (collection !== null) {
        const docs = await collection.find({}).toArray();
        res.json(docs);
      }
    });

    app.post("/submit", async (req, res) => {
      const result = await collection.insertOne(req.body);
      res.json(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }

  collection = await client.db("datatest").collection("test");
}

run().catch(console.dir);
