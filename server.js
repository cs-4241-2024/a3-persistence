const express = require("express"),
      {MongoClient, ObjectId} = require("mongodb"),
      app = express(),
      session = require('express-session');

app.use(express.static("public") )
app.use(express.json() )

app.use(session({
  secret: 'wasd46WASD$^',
  resave: false,
  saveUninitialized: false,
  cookie: {secure: false} 
}));

const uri = `mongodb+srv://jeolsen:GreatFrog22!!!@a3.h8t1k.mongodb.net`;
const client = new MongoClient(uri);
let collection = null;
let usersCollection = null;

function computeDeadline(task) {
  const creationDate = new Date(task.created_at);
  let daysToAdd = 1; //Default is 1 day for highest priority

  if (task.priority === 2) {
    daysToAdd = 2;
  } else if (task.priority === 3) {
    daysToAdd = 3;
  }

  creationDate.setDate(creationDate.getDate() + daysToAdd);
  task.deadline = creationDate.toISOString().split('T')[0]; 
}

async function run() {
  await client.connect();
  collection = await client.db("datatest").collection("test");
  usersCollection = await client.db("datatest").collection("users");

  app.post('/register', async (req, res) => {
    const {username, password} = req.body;

    const existingUser = await usersCollection.findOne({username});
    if (existingUser) {
      return res.status(400).json({message: 'User already exists'});
    }

    await usersCollection.insertOne({username, password});
    res.json({status: 'User registered successfully'});
  });

  app.post('/login', async (req, res) => {
    const {username, password} = req.body;

    const user = await usersCollection.findOne({username, password});
    if (!user) {
      return res.status(400).json({message: 'Invalid username or password'});
    }

    req.session.userId = user._id;
    res.json({status: 'Logged in successfully'});
  });

  const requireLogin = (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).json({message: 'Unauthorized'});
    }
    next();
  };

  app.post("/submit", requireLogin, async (req, res) => {
    const {action, task, priority} = req.body;
    const userId = req.session.userId; //Get the logged in users ID

    if (action === 'get') {
      //Retrieve only tasks for the logged-in user
      const tasks = await collection.find({userId: new ObjectId(userId)}).toArray();
      res.json(tasks);
    } 
    else if (action === 'add') {
      //Create a new task amd associate it with the logged in user
      const newTask = {
        task,
        priority: parseInt(priority),
        created_at: new Date().toISOString().split('T')[0],
        userId: new ObjectId(userId) //Attach unique mongodb userId to the task
      };
      computeDeadline(newTask);
      await collection.insertOne(newTask);

      const tasks = await collection.find({userId: new ObjectId(userId)}).toArray();
      res.json({status: 'success', tasks});
    } 
    else if (action === 'delete') {
      //Delete task for the logged in user
      await collection.deleteOne({task, userId: new ObjectId(userId)});
      const tasks = await collection.find({userId: new ObjectId(userId)}).toArray();
      res.json({status: 'deleted', tasks});
    } 
    else {
      res.status(400).json({error: 'Invalid action'});
    }
  });

  app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send('Error logging out');
      }
      //Redirect to login page after logout
      res.redirect('/login.html'); 
    });
  });
}

run();

app.listen(3000);
