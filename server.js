require('dotenv').config();

const express = require("express"),
      { MongoClient, ObjectId } = require("mongodb"),
      app = express()

app.use(express.static("public") )
app.use(express.json() )
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}`
const client = new MongoClient( uri )
const path = require('path'); 

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("a3-database").collection("To-do-list")

  // route to get all docs
  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json( docs )
    }
  })
}

run()


//Middle ware
app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

//Add Route to inser a todo
app.post( '/submit', async (req,res) => {
  console.log(req.body)
  const result = await collection.insertOne( req.body )
  res.json( result )
})

//Add Route to remove a todo
//assumes req.body takes form { _id:5d91fb30f3f81b282d7be0dd } etc.
app.post( '/remove', async (req,res) => {
  const result = await collection.deleteOne({ 
    _id:new ObjectId( req.body._id ) 
  })
  
  res.json( result )
})

//Add a Route to update a document
app.post( '/update', async (req,res) => {
  const result = await collection.updateOne(
    { _id: new ObjectId( req.body._id ) },
    { $set:{ name:req.body.name } }
  )

  res.json( result )
})

// Mock data to store tasks
let appdata = [
  { "task": "Quiz", "priority": "Low", "creationdate": "09/02/2024", "duedate": "09/19/2024", "dueTime": "0" },
];

// Route to handle the main page request (GET request for the homepage)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Handle POST requests for task submission
app.post('/submit', (req, res) => {
  let dataJson = req.body; // Express automatically parses JSON
  appdata.push(dataJson); // Add task to appdata
  console.log('After submit:', appdata);
  
  res.json(appdata); // Send the updated task list back
});

// Handle POST requests for task deletion
app.post('/delete', (req, res) => {
  let dataJson = req.body;
  let taskToDelete = dataJson.task;
  appdata = appdata.filter(item => item.task !== taskToDelete); // Remove task
  console.log('After delete:', appdata);
  
  res.json(appdata); // Send the updated task list back
});

// Function to calculate days left (unchanged)
function calculateDaysLeft(dueDay) {
  let currentDate = new Date();
  let dueDate = new Date(dueDay);
  let timeDiff = dueDate.getTime() - currentDate.getTime();
  let daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysLeft > 0 ? daysLeft : 0;  // Return 0 if the due date has passed
}

// Start the server on the specified port

app.listen(3001)