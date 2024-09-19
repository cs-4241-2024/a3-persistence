const express = require("express"),
  { MongoClient, ObjectId } = require("mongodb"),
  cookie = require("cookie-session"),
  hbs = require("express-handlebars").engine,
  app = express();

app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", hbs());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(
  cookie({
    name: "session",
    keys: ["kdfjsdnf", "ddfokdne"],
  })
);

app.use(express.static("public"));
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
const client = new MongoClient(uri);

let collection = null;
let user;
let pass;

async function run() {
  await client.connect();
  collection = await client.db("datatest").collection("test");
}

run();

app.post("/login", async (req, res) => {
  console.log(req.body);
  const verify = await collection.findOne({
    username: req.body.username,
    password: req.body.password,
  });
  
  user = req.body.username;
  pass = req.body.password;
  
  req.session.login = true;
  res.redirect("index.html");

    
});

app.get("/", (req, res) => {
  res.render("main", { msg: "", layout: false });
});

app.use(function (req, res, next) {
  if (req.session.login === true) next();  

});

app.get("/index.html", (req, res) => {
  res.render("index", { msg: "success you have logged in", layout: false });
});

app.use((req, res, next) => {
  if (collection !== null) {
    next();
  } else {
    res.status(503).send();
  }
});

// route to get all docs
app.get("/docs", async (req, res) => {
  if (collection !== null) {
    const docs = await collection.find({username: `${user}`}).toArray();
    res.json(docs);
  }
});

app.post("/add", async (req, res) => {
  req.body.username = user;
  req.body.password = pass;
  const result = await collection.insertOne(req.body);
  res.json(result);
});

app.post("/rmv", async (req, res) => {
  const result = await collection.deleteOne({
    _id: new ObjectId(req.body.name),
  });

  res.json(result);
});

app.post("/updates", async (req, res) => {
  const result = await collection.updateOne(
    { _id: new ObjectId(req.body._id) },
    {
      $set: {
        task: req.body.task,
        date: req.body.date,
        priority: req.body.priority,
      },
    }
  );

  res.json(result);
});

app.listen(process.env.PORT || 3000);
