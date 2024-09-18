const express = require("express"),
  { MongoClient, ObjectId } = require("mongodb"),
  cookie = require("cookie-session"),
  app = express();

app.use(express.static("public"));
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
const client = new MongoClient(uri);

let collection = null;
let reqID;

async function run() {
  await client.connect();
  collection = await client.db("A3").collection("A3Data");
}

run();

app.use(express.urlencoded({ extended: true }));

app.use(
  cookie({
    name: "session",
    keys: ["big", "worm"],
  })
);

app.post("/login", async (req, res) => {
  const username = req.body.user;
  const password = req.body.pass;
  const doc = await collection.findOne({
    $and: [{ user: { $eq: username } }, { pass: { $eq: password } }],
  });
  console.log(doc);

  if (doc !== null) {
    reqID = doc._id;
    req.session.login = true;
    res.redirect("main.html");
  } else {
    // password incorrect, redirect back to login page
    res.sendFile(__dirname + "/public/index.html");
  }
});

app.get("/", (req, res) => {
  res.render("index", { msg: "", layout: false });
});

// add some middleware that always sends unauthenicaetd users to the login page
app.use(function (req, res, next) {
  if (req.session.login === true) next();
  else res.sendFile(__dirname + "/public/index.html");
});

// route to get all docs
app.get("/docs", async (req, res) => {
  if (collection !== null) {
    const docs = await collection.find({}).toArray();
    res.json(docs);
  }
});

app.use((req, res, next) => {
  if (collection !== null) {
    next();
  } else {
    res.status(503).send();
  }
});

app.post("/add", async (req, res) => {
  const result = await collection.insertOne(req.body);
  res.json(result);
});

// assumes req.body takes form { _id:5d91fb30f3f81b282d7be0dd } etc.
app.post("/remove", async (req, res) => {
  const result = await collection.deleteOne({
    _id: new ObjectId(reqID),
  });

  res.json(result);
});

app.post("/update", async (req, res) => {
  console.log(reqID);
  const result = await collection.updateOne(
    { _id: new ObjectId(reqID) },
    {
      $set: [
        { name: req.body.Name},
      ],
    }
  );

  res.json(result);
});

app.listen(process.env.PORT || 3000);
