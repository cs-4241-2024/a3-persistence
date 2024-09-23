const express = require("express"),
  cookie = require("cookie-session"),
  hbs = require("express-handlebars").engine,
  app = express();

app.engine("handlebars", hbs());
app.set("view engine", "handlebars");
app.set("views", "./views");

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
        const docs = await collection
          .find({ user: req.session.user })
          .toArray();
        res.json(docs);
      }
    });

    app.post("/submit", async (req, res) => {
      // Add total time to array
      req.body.lapTimes.push(
        req.body.lapTimes[0] + req.body.lapTimes[1] + req.body.lapTimes[2]
      );
      req.body.user = req.session.user;

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

app.post("/login", async (req, res) => {
  if (collection === null) res.sendFile(__dirname + "/public/index.html");
  const users = await collection
    .find({ username: { $exists: true } })
    .toArray();

  let accountFound = false;
  for (let user of users) {
    if (req.body.username === user.username) {
      if (req.body.password === user.password) {
        // Correct username and password, login
        req.session.login = true;
        req.session.user = req.body.username;
        accountFound = true;
        res.render("main", {
          welcome: "Welcome " + req.body.username,
          layout: false,
        });
        break;
      } else {
        // Wrong password
        accountFound = true;
        res.render("index", {
          msg: "Wrong password, please try again",
          layout: false,
        });
        break;
      }
    }
  }

  if (!accountFound) {
    // No user with this username found, make new account and login

    collection.insertOne({
      username: req.body.username,
      password: req.body.password,
    });
    req.session.login = true;
    req.session.user = req.body.username;

    res.render("main", {
      welcome: "New account created: " + req.body.username,
      layout: false,
    });
  }
});

app.use(function (req, res, next) {
  if (req.session.login === true) {
    next();
  } else res.render("index", { msg: "", layout: false });
});

app.get("/main.html", (req, res) => {
  res.render("main", { welcome: "Welcome " + req.session.user, layout: false });
});

app.get("/logout", async (req, res) => {
  res.render("index", {
    msg: "Successfully logged out",
    layout: false,
  });
  req.session.login = false;
  req.session.user = undefined;
});

app.use(express.static("public"));

app.listen(process.env.PORT || 3000);
