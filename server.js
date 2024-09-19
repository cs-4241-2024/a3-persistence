require("dotenv").config();
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();

app.use(express.static("public/"));
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
const client = new MongoClient(uri);

let collection = null;

async function run() {
  await client.connect();
  collection = await client.db("A3").collection("userdata");
  app.get("/data/:username", async (req, res) => {
    if (collection !== null) {
      const username = req.params.username;
      const data = await collection.find({ username: username }).toArray();
      res.end(JSON.stringify(data));
    }
  });
}

run();

app.use((req, res, next) => {
  if (collection !== null) {
    next();
  } else {
    res.status(503).send();
  }
});

app.post("/delete", async (req, res) => {
  const game = req.body.game;
  const deletedGame = await collection.find({ game: game }).toArray();
  const result = await collection.deleteOne(deletedGame).toArray();
  res.end(JSON.stringify(result));
});

app.post("/modify/:game", async (req, res) => {
  const result = await collection.updateOne(
    { _id: new ObjectId(req.body._id) },
    { $set: { game: req.body.game, genre: req.body.genre, cost: req.body.cost, discount: req.body.discount } }
  ).toArray();

  res.end(JSON.stringify(result));
});

app.post("/modify", async (req, res) => {
  const result = await collection.updateOne(
    { _id: new ObjectId(req.body._id) },
    { $set: { name: req.body.name } }
  );

  res.end(JSON.stringify(result));
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const findUsername = await collection.find({ username: username }).toArray();
  if (findUsername.length > 0) {
    const foundPassword = findUsername[0].password;
    if (foundPassword == password) {
      res.end(JSON.stringify(findUsername[0]));
    } else {
      res.end(JSON.stringify(findUsername[0]));
    }
  } else {
    const result = await collection.insertOne(req.body);
    res.end(JSON.stringify(result));
  }
});

app.listen(process.env.PORT || 3000);
