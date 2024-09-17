const express = require("express");
const path = require("path");
const { MongoClient, ServerApiVersion } = require("mongodb");
const session = require("express-session");
const mime = require("mime");
const fs = require("fs");

const dir = "public/";
const port = 3000;

const uri =
  "mongodb+srv://sgkalavantis:<Cookie#1011>@sophiagk.65kgk.mongodb.net/?retryWrites=true&w=majority&appName=SophiaGK";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let tasksCollection;
let usersCollection; 


async function run() {
  try {
    await client.connect();

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const database = client.db("SophiaGK");
    tasksCollection = database.collection("tasks");
    usersCollection = database.collection("users");


    const app = express();
    app.use(express.json()); 
    app.use(express.static(path.join(__dirname, "public"))); 

    app.use(
      session({
        secret: "23759034fbrcs939rh382ejc",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }, 
      })
    );

    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "public", "index.html"));
    });

    app.post("/register", async (req, res) => {
      const { username, password } = req.body;
      const user = await usersCollection.findOne({ username });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }
      await usersCollection.insertOne({ username, password });
      res.status(200).json({ message: "User registered successfully" });
    });

    app.post("/login", async (req, res) => {
      const { username, password } = req.body;
      const user = await usersCollection.findOne({ username });
      if (!user || user.password !== password) {
        return res
          .status(400)
          .json({ message: "Invalid username or password" });
      }
      req.session.userId = user._id;
      res.status(200).json({ message: "Login successful" });
    });

    app.post("/logout", (req, res) => {
      req.session.destroy(() => {
        res.status(200).json({ message: "Logged out successfully" });
      });
    });

    app.get("/tasks", async (req, res) => {
      if (!req.session.userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      const tasks = await tasksCollection
        .find({ userId: req.session.userId })
        .toArray();
      res.status(200).json(tasks);
    });

    app.post("/add", async (req, res) => {
      if (!req.session.userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      const { task, priority } = req.body;
      const newTask = {
        task,
        priority,
        created_at: new Date(),
        deadline: calculateDeadline(priority),
        userId: req.session.userId,
      };
      await tasksCollection.insertOne(newTask);
      res.status(200).json(newTask);
    });

    app.post("/clear", async (req, res) => {
      if (!req.session.userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      await tasksCollection.deleteMany({ userId: req.session.userId });
      res.status(200).send("Tasks cleared");
    });

    app.get("/:filename", (req, res) => {
      const filename = path.join(__dirname, "public", req.params.filename);
      sendFile(res, filename);
    });

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);
  }
}

function calculateDeadline(priority) {
  const currentDate = new Date();
  if (priority === "high") {
    return new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000);
  } else if (priority === "medium") {
    return new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000);
  } else {
    return new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
  }
}

const sendFile = function (response, filename) {
  const type = mime.getType(filename);
  fs.readFile(filename, function (err, content) {
    if (err === null) {
      response.writeHead(200, { "Content-Type": type });
      response.end(content);
    } else {
      response.writeHead(404);
      response.end("404 Error: File Not Found");
    }
  });
};

run().catch(console.dir);
