const express = require('express');
const { MongoClient, ObjectID, ServerApiVersion } = require('mongodb');
const path = require('path'); // For handling file paths
const app = express();
const port = 3000;

// Mongo DB connection URI
const uri = "mongodb+srv://thesmarjoseph:pX8VxpzVLRjWsdAs@cluster-a3.fef6u.mongodb.net/?retryWrites=true&w=majority&appName=cluster-a3";

//create a mongocient with a mongo client options object
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict:true,
    deprecationErrors:true,
  }
});

// define database and collection names
const dbName = 'moodsDB'
const collectionName = 'moods';

//connect to Mongo DB
let db;
let collection;


async function connectToMongo() {
  try {
    await client.connect();

    db = client.db(dbName);
    collection = db.collection(collectionName);
    console.log("Connected to MongoDB Atlas!");
  } catch (err){
    console.error('Failed to connect to mongoDB', err);
    process.exit(1);
  }
}

// middlewear to handle JSON requests
app.use(express.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

connectToMongo();

// serve the main
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// return list of moods as json
app.get('/results', async (req, res) => {
  try {
    const moods = await collection.find({}).toArray();
    res.json(moods);
  } catch (err){
    res.status(500).json({message: 'Error fetching moods', error: err});
  }
});

// Handle POST requests to add new moods
app.post('/add-mood', async (req, res) => {
  const newMood = req.body;
  newMood.timestamp = new Date().toISOString();
  newMood.moodScore = calculateMoodScore(newMood.mood);

  try {
    await collection.insertOne(newMood);
    const moods = await collection.find({}).toArray();
    res.status(200).json(moods);
  } catch (err){
    res.status(500).json({message: 'Error adding mood', error: err});
  }
});

// DELETE requests to remove a mood by request body
app.delete('/delete-mood/:id',async  (req, res) => {
  const mood = req.body;

  try {
    await collection.deleteOne(mood);
    const moods = await collection.find({}).toArray();
    res.status(200).json(moods);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting mood', error: err });
  }
});

// calculate mood score
const calculateMoodScore = (mood) => {
  switch (mood) {
    case 'happy': return 8;
    case 'sad': return 3;
    case 'angry': return 2;
    case 'excited': return 7;
    default: return 5;
  }
};

// start server
app.listen(process.env.PORT || port, () => {
  console.log(`Server is running on port ${port}`);
});
