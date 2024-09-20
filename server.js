const express = require("express"),
  cookie = require("cookie-session"),
  app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cookie Middleware
app.use(
  cookie({
    name: "session",
    keys: ["aFc8XCiCEi", "GwMkrENdw6"],
  })
);

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

    app.post("/update", async (req, res) => {
      // Create laptimes array
      const lapTimes = [
        req.body.lap1,
        req.body.lap2,
        req.body.lap3,
        Number(req.body.lap1) + Number(req.body.lap2) + Number(req.body.lap3),
      ];

      // Add time to database
      await collection.updateOne(
        { _id: new ObjectId(req.body._id) },
        { $set: { lapTimes: lapTimes } }
      );

      // Return user to game page
      res.redirect("main.html");
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

run().catch(console.dir);

app.post("/login", (req, res) => {
  req.session.login = true;
  res.redirect("main.html");
});

app.use(function (req, res, next) {
  if (req.session.login === true) {
    console.log("Logged in");
    // req.session.login = false;
    next();
  } else res.sendFile(__dirname + "/public/index.html");
});

app.use(express.static("public"));

app.listen(process.env.PORT || 3000);
