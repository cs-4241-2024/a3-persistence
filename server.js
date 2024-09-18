require('dotenv').config();
const express = require("express"),
      { MongoClient, ObjectId } = require("mongodb"),
      app = express();

app.use(express.static("public"));
app.use(express.json());

// MongoDB connection setup
const uri = `mongodb+srv://${process.env.USER_A3}:${process.env.PASSWORD}@cluster0.5hgmv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri);

let collection = null;

async function run() {
  await client.connect();
  collection = await client.db("A3").collection("workoutData");  // Changed collection name for clarity
}

run();

// Route to get all documents (equivalent to /onLoad)
app.get("/docs", async (req, res) => {
  if (collection !== null) {
    const docs = await collection.find({}).toArray();
    res.json(docs);
  }
});

// POST request to add data (equivalent to /submit)
app.post('/submit', async (req, res) => {
  const parsed = req.body;
  // Convert sets and reps to numbers before calculating total
  parsed.sets = parseInt(parsed.sets);
  parsed.reps = parseInt(parsed.reps);
  parsed.weight = parseInt(parsed.weight)
  parsed.total = parsed.sets * parsed.reps * parsed.weight;  // Calculate the total based on sets and reps
  console.log('This is parsed '+JSON.stringify(parsed))

  if (collection !== null) {
    const result = await collection.insertOne(parsed);
    const docs = await collection.find({}).toArray();  // Return all documents after insertion
    res.json(docs);
  }
});

// POST request to clear all data (equivalent to /clear)
app.post('/clear', async (req, res) => {
  if (collection !== null) {
    await collection.deleteMany({});  // Delete all documents in the collection
    res.json({ data: [] });  // Respond with an empty array
  }
});

// POST request to delete a specific item (equivalent to /delete)
app.post('/delete', async (req, res) => {
  const { index } = req.body;

  if (collection !== null) {
    const docs = await collection.find({}).toArray();
    const docToDelete = docs[index];

    if (docToDelete) {
      await collection.deleteOne({ _id: docToDelete._id });  // Delete by ObjectId
      const updatedDocs = await collection.find({}).toArray();  // Return all documents after deletion
      res.json(updatedDocs);
    } else {
      res.status(404).send('Document not found');
    }
  }
});

app.post('/update', async (req, res) => {
  const { id, updatedData } = req.body;  // Extract id and updated data from the request
  
  const total = updatedData.sets * updatedData.reps * updatedData.weight;


  if (collection !== null) {
    // Update the document with the new data
    await collection.updateOne(
      { _id: new ObjectId(id) }, 
      { $set: updatedData });

    // Return the updated documents after the update
    const docs = await collection.find({}).toArray();
    res.json(docs);
  }
});


// Route to add data to the database (already in your assignment 3)
app.post('/add', async (req, res) => {
  if (collection !== null) {
    const result = await collection.insertOne(req.body);
    res.json(result);
  }
});

// Start the Express server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
