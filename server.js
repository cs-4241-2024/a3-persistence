// importing the required oackages
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config()

// 
const Sushi = require('./models/sushiModel');
const app = express();

const PORT = process.env.PORT || 3001;
// const username = process.env.username;
// const password = process.env.PASSWORD;
// const dbname = process.env.DBNAME;
// console.log(username, password, dbname);
const connectionURL = `mongodb+srv://skylerlin:flora1234@cluster0.hb0bf.mongodb.net/a3-skylerlin`;

// const connectionURL = `mongodb+srv://${username}:${password}@cluster0.hb0bf.mongodb.net/${dbname}`;

// app.use(bodyParser.json());

// Serve static files from 'public' and 'views'
app.use(express.static('public'));
app.use(express.static('views'));

async function connection() {
  try {
    await mongoose.connect(connectionURL);
  } catch (error) {
    console.error(error);
  }
}

connection();
// Serve index.html for root request
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Middleware for handling JSON requests
app.use(express.json());

// Handle POST requests to '/submit'
app.post('/submit', async (req, res) => {

  const {dream} = req.body;
  try {
    const newDream = new Sushi({dream});
    await newDream.save();
    res.status(201).json({newDream});
  } catch (error) {
    res.status(400).json({error: error});
  }


});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
