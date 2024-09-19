const express = require("express");
const { MongoClient } = require("mongodb");
const session = require("express-session");

const port = 3000;

const uri =
  "mongodb+srv://sgkalavantis:Cookie1011@sophiagk.65kgk.mongodb.net/?retryWrites=true&w=majority&appName=SophiaGK";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let tasksCollection;
let usersCollection;


async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const database = client.db("SophiaGK");
    tasksCollection = database.collection("tasks");
    usersCollection = database.collection("users");

    const app = express();
    app.use(express.json());

    app.use(
      session({
        secret: "Cookie",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false },
      })
    );

    app.post("/register", async (req, res) => {
      try {
        const { username, password } = req.body;
        const user = await usersCollection.findOne({ username });
        if (user) {
          return res.status(400).json({ message: "User already exists" });
        }
        await usersCollection.insertOne({ username, password });
        res.status(200).json({ message: "User registered successfully" });
      } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
      }
    });

    app.post("/login", async (req, res) => {
      try {
        const { username, password } = req.body;
        const user = await usersCollection.findOne({ username });
        if (!user || user.password !== password) {
          return res.status(400).json({ message: "Invalid username or password" });
        }
        req.session.userId = user._id;
        res.status(200).json({ message: "Login successful" });
      } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
      }
    });

    app.post("/logout", (req, res) => {
      try {
        req.session.destroy(() => {
          res.status(200).json({ message: "Logged out successfully" });
        });
      } catch (error) {
        res.status(500).json({ message: "Error logging out", error });
      }
    });

    app.get("/tasks", async (req, res) => {
      try {
        if (!req.session.userId) {
          return res.status(403).json({ message: "Unauthorized" });
        }
        const tasks = await tasksCollection
          .find({ userId: req.session.userId })
          .toArray();
        res.status(200).json(tasks);
      } catch (error) {
        res.status(500).json({ message: "Error fetching tasks", error });
      }
    });

    app.post("/add", async (req, res) => {
      try {
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
      } catch (error) {
        res.status(500).json({ message: "Error adding task", error });
      }
    });
    
    app.post("/clear", async (req, res) => {
      try {
        if (!req.session.userId) {
          return res.status(403).json({ message: "Unauthorized" });
        }
        await tasksCollection.deleteMany({ userId: req.session.userId });
        res.status(200).send("Tasks cleared");
      } catch (error) {
        res.status(500).json({ message: "Error clearing tasks", error });
      }
    });

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting the app:", error);
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

run().catch(console.dir);

