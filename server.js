const express = require("express"),
  app = express();

app.use(express.static("public"));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
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
      // Add total time to array
      req.body.lapTimes.push(
        req.body.lapTimes[0] + req.body.lapTimes[1] + req.body.lapTimes[2]
      );

      // Add time to database
      await collection.insertOne(req.body);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "success" }));
    });

    app.delete("/delete", async (req, res) => {
      // Remove time from database
      const result = await collection.deleteOne({
        _id: new ObjectId(req.body._id),
      });

      res.json(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }

  collection = await client.db("datatest").collection("test");
}

app.listen(process.env.PORT || 3000);

run().catch(console.dir);
