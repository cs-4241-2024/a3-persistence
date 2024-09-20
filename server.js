require('dotenv').config();
const express = require("express"),
      fs   = require( 'fs' ),
      mime = require( 'mime' ),
      bodyParser = require('body-parser'), 
      {MongoClient} = require('mongodb'),
      dir  = 'public/',
      port = 3000;


//express setup
const app = express();

//mongodb setup
const connection = process.env.MONGO_URI;
const client = new MongoClient(connection);
let collection;

//connect to mongodb
async function connectToMongo() {
  try {
    await client.connect();
    const database = client.db('anime-tracker');
    collection = database.collection('anime-cards');
    console.log('Connected to MongoDB Atlas');
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

//route to return appdata
app.get("/appdata", (req, res) => {
  res.status(200).json(appdata);
});

app.post("/submit", (req, res) => {
  const formData = req.body;

  const newEntry = {
    'username': formData.username,
    'show title': formData.showName,
    'last ep watched': Number(formData.lastViewed),
    'date logged': getDate()
  };

  appdata.push(newEntry);
  console.log(appdata);

  res.status(200).json(appdata);
});

app.delete("/submit", (req, res) => {
  const {username, showTitle} = req.body;

  const newAppData = appdata.filter(entry => 
    !(entry.username === username && entry['show title'] === showTitle)
  );

  appdata.length = 0;
  appdata.push(...newAppData);

  res.status(200).json(appdata);
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
