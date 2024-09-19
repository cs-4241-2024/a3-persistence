const express = require("express"),
  { MongoClient, ObjectId } = require("mongodb"),
  dotenv = require("dotenv").config(),
  app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(express.json());

// TODO get password from .env
const uri = `mongodb+srv://scribblemelon:${process.env.PASS}@cluster0.gvm9v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri);

let currentUser = null;

app.post("/login", async (req, res) => {
  //check for exitstence of username
  let userLogin = await collectionUsers.findOne({
    username: req.body.username,
  });
  if (userLogin === null) {
    //create new user
    let newUser = await collectionUsers.insertOne({
      username: req.body.username,
      password: req.body.password,
    });
    currentUser = req.body.username;
    res.redirect("main.html");
  } else {
    if (userLogin.password === req.body.password) {
      currentUser = req.body.username;
      res.redirect("main.html");
    }
  }
});

app.post("/submit", async (req, res) => {
  const newEvent = await collectionEvents.insertOne({
    user: currentUser,
    name: req.body.name,
    date: req.body.date,
    sold: req.body.sold,
    capacity: req.body.capacity,
    status: req.body.status,
  });

  const userEvents = await collectionEvents
    .find({ user: currentUser }, { projection: { _id: 0, user: 0 } })
    .toArray();

  res.json(userEvents);
});

app.post("/edit", async (req, res) => {
  const filter = { user: currentUser, name: req.body.name };
  //insert if cant update
  const options = { upsert: true };
  const updateDoc = {
    $set: {
      date: req.body.date,
      sold: req.body.sold,
      capacity: req.body.capacity,
      status: req.body.status,
    },
  };
  const result = await collectionEvents.updateOne(filter, updateDoc, options);

  const userEvents = await collectionEvents
    .find({ user: currentUser }, { projection: { _id: 0, user: 0 } })
    .toArray();

  res.json(userEvents);
});

app.post("/delete", async (req, res) => {
  const result = await collectionEvents.deleteOne({
    user: currentUser,
    name: req.body.name,
  });

  const userEvents = await collectionEvents
    .find({ user: currentUser }, { projection: { _id: 0, user: 0 } })
    .toArray();

  res.json(userEvents);
});

let collectionUsers = null;
let collectionEvents = null;
async function run() {
  await client.connect();
  collectionUsers = await client.db("event_database").collection("users");
  collectionEvents = await client.db("event_database").collection("events");
}

run();

const listener = app.listen(process.env.PORT || 3000);
