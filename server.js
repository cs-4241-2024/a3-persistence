require('dotenv').config();
const express = require("express"),
      fs   = require( 'fs' ),
      mime = require( 'mime' ),
      bodyParser = require('body-parser'), 
      {MongoClient} = require('mongodb'),
      bcrypt = require('bcrypt'),
      saltRounds = 10,
      dir  = 'public/',
      port = 3000;


//express setup
const app = express();

//mongodb setup
const connection = process.env.MONGO_URI;
const client = new MongoClient(connection);
let cardCollection;
let userCollection;

//connect to mongodb
async function connectToMongo() {
  try {
    await client.connect();

    //access all users on website
    const userDatabase = client.db('accounts');
    userCollection = userDatabase.collection('users');

    //create unique index (trying to ensure no duplicate usernames)
    await userCollection.createIndex({username: 1}, {unique: true});
    
    //access all cards in database
    const cardDatabase = client.db('anime-tracker');
    cardCollection = cardDatabase.collection('anime-cards');

    console.log('Connected to MongoDB Atlas: card database and user database accessed');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
  }
}

//temp data
const appdata = [
  { 'username': 'Ananya', 'show title': "Jujutsu Kaisen", 'last ep watched': 12, 'date logged': '9/9/2024' },
]

app.use(bodyParser.json());           //middleware handles JSON request bodies
app.use(express.static('public'));    //serves files from the 'public' directory


//route to serve the main page
app.get("/", (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
 
//route to serve the register page
app.get("/register", (req, res) => {
  res.sendFile(__dirname + '/public/register.html');
});
  
//route to return appdata
app.get("/appdata", async (req, res) => {
  try {
    const entries = await cardCollection.find({}).toArray();
    res.status(200).json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Error retriving data from table'});
  }
  
});

//submits and creates a card
app.post("/submit", async (req, res) => {
  const formData = req.body;

  const newEntry = {
    'username': formData.username,
    'show title': formData.showName,
    'last ep watched': Number(formData.lastViewed),
    'date logged': getDate()
  };

  try {
    await cardCollection.insertOne(newEntry);
    const allEntries = await cardCollection.find({}).toArray();
    res.status(200).json(allEntries);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Error submitting data'});
  }
});


//attempting to register a user
app.post("/register", async (req, res) => {
  const { firstName, lastName, username, password } = req.body;

  try {

  const hashedPassword = await bcrypt.hash(password, saltRounds);
 
  const newUser = {
    firstName: firstName,
    lastName: lastName,
    username: username,
    password: hashedPassword,
    createdAt: getDate(),
  };

    await userCollection.insertOne(newUser);
    res.status(201).json({message: 'User registered successfully!'});
  } catch (error) {
    if (error.code === 11000) { //duplicate key detected error code
      return res.status(400).json({message: 'Username already exists.'});
    }
    console.error('Error registering user: ', error);
    res.status(500).json({message: 'Error registering user.'});
  }

});

app.delete("/delete", async (req, res) => {
  const {username, showTitle} = req.body;

  try {
    await cardCollection.deleteOne({'username': username, 'show title': showTitle});
    const allEntries = await cardCollection.find({}).toArray();
    res.status(200).json(allEntries);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Error deleting data'});
  }
});

//helper function --> gets current date
function getDate() {
  const date = new Date();

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}

connectToMongo().then(() => {
  app.listen(port, () => {
    console.log(`Anime tracker listening on port ${port}`);
  });
});
