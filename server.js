const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const uri = `mongodb+srv://${process.env.secret_name}:${process.env.secret_pass}@cluster0.bbhpq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const session = require("express-session");




const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


app.use(session({
  secret:'abcdefghijklmnopqrstuvwxyz',
  saveUninitialized: false,
  resave: false
}));


app.use(express.static("public"));
app.use(express.json());


let collection;


async function run() {
  await client.connect();
  collection = await client.db("a3_data").collection("task");
}

run();


app.get("/getTask", async (req, res) => {
  try {
    const tasks = await collection.find().toArray();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json("Failed");
  }
});

app.post("/submit", (req, res) => {
  console.log("Submit")
  const { name, task, priority } = req.body;
  const date = new Date().toLocaleDateString();

  const newTask = { name, task, priority, date };

  try {
    const push = collection.insertOne(newTask);
    res
      .status(201)
      .json({ message: "Task added successfully", taskId: push.insertedId });
  } catch (error) {
    res.status(500).json("Failed");
  }
});

app.delete("/deleteTask/:id", async (req, res) => {
  const taskId = req.params.id;
  console.log(taskId);
  const del = await collection.deleteOne({ _id: new ObjectId(taskId) });

  if (del.deletedCount === 1) {
    const update = collection.find().toArray();
  }
});



app.listen(3000);
