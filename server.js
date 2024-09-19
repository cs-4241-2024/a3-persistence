const { error } = require('console');
const express = require('express');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
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
const moodsCollectionName = 'moods';
const usersCollectionName = 'user';

//connect to Mongo DB
let db;
let moodsCollection;
let usersCollection;


async function connectToMongo() {
  try {
    await client.connect();

    db = client.db(dbName);
    moodsCollection = db.collection(moodsCollectionName);
    usersCollection = db.collection(usersCollectionName);
    console.log("Connected to MongoDB Atlas!");
  } catch (err){
    console.error('Failed to connect to mongoDB', err);
    process.exit(1);
  }
}

// middleware to handle JSON requests
app.use(express.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

connectToMongo();

// serve the main
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// return list of moods as json
app.get('/results/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const moods = await moodsCollection.find({userId: new ObjectId(userId)}).toArray();
    res.json(moods);
  } catch (err){
    res.status(500).json({message: 'Error fetching moods', error: err});
  }
});

app.post('/login', async (req, res) => {
  const {username, password} = req.body;

  try {
    const user = await usersCollection.findOne({username});

    if (user){

      if (user.password === password){
        res.json({success: true, userId: user._id});
      } else {
        res.status(401).json({success:false, message: 'Invalid password'});
      }
    } else {
      const newUser = {username, password};
      const result = await usersCollection.insertOne(newUser);
      res.json({success: true, userId: result.insertedId });
    }
  } catch (err){
    res.status(500).json({message: 'Error logging in', error: err});
  }

});

// Handle POST requests to add new moods
app.post('/add-mood', async (req, res) => {
  const {userId, mood} = req.body;

  const newMood = {
    userId: new ObjectId(userId),
    name: req.body.name,
    mood: mood,
    comment: req.body.comment || '',
    timestamp: new Date().toUTCString(),
    moodScore: calculateMoodScore(mood)
  }
  try {
    await moodsCollection.insertOne(newMood);
    const moods = await moodsCollection.find({userId: new ObjectId(userId)}).toArray();
    res.status(200).json(moods);
  } catch (err){
    res.status(500).json({message: 'Error adding mood', error: err});
  }
});

// DELETE requests to remove a mood by request body
app.delete('/delete-mood/:id/:userId',async  (req, res) => {
  const {id, userId} = req.params;

  try {
    await moodsCollection.deleteOne({_id: new ObjectId(id), userId: new ObjectId(userId)});
    const moods = await moodsCollection.find({userId: new ObjectId(userId)}).toArray();
    res.status(200).json(moods);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting mood', error: err });
  }
});

app.put('/modify-mood/:id', async (req, res) => {
  const {id} = req.params;
  const {name, mood, comment, userId} = req.body;

  try {
    const updatedMood = {
      name, 
      mood,
      comment,
      moodScore: calculateMoodScore(mood)
    };

    await moodsCollection.updateOne(
      {_id: new ObjectId(id), userId: new ObjectId(userId)},
      {$set: updatedMood}
    );

    const moods = await moodsCollection.find({userId: new ObjectId(userId)}).toArray();
    res.status(200).json(moods);
  } catch(err) {
    res.status(500).json({message: 'Error updating mood', error: err});

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
