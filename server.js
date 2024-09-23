require('dotenv').config();
const express = require("express"),
      fs   = require( 'fs' ),
      mime = require( 'mime' ),
      bodyParser = require('body-parser'), 
      {MongoClient} = require('mongodb'),
      { ObjectId } = require('mongodb'),
      bcrypt = require('bcrypt'),
      saltRounds = 10,
      cookieParser = require('cookie-parser'),
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

//cookie-parser setup
app.use(cookieParser());

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

//route to serve the login page
app.get("/login", (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
})
  
//route to return appdata
app.get("/appdata", async (req, res) => {
  
  const username = req.cookies.username;

  if (!username) {
    return res.status(401).json({message: 'Unauthorized. Please register/login.'});
  }
  
  try {
    const entries = await cardCollection.find({ username: username }).toArray();
    res.status(200).json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Error retriving data from table'});
  }
  
});

//submits and creates a card
app.post("/submit", async (req, res) => {
  const formData = req.body;

  console.log("Cookies:", req.cookies); //debug
  const username = req.cookies.username;
  console.log(username);

  if (!username) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }

  const newEntry = {
    'username': username,
    'show title': formData.showName,
    'last ep watched': Number(formData.lastViewed),
    'date logged': getDate()
  };

  try {
    await cardCollection.insertOne(newEntry);
    const allEntries = await cardCollection.find({ username: username }).toArray();
    res.status(200).json(allEntries);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Error submitting data'});
  }
});


//handles the registration of a user
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
    res.cookie('username', username, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000}); //cookie is set to expire in 24 hours})
    res.status(201).json({message: 'User registered successfully!'});
  } catch (error) {
    if (error.code === 11000) { //duplicate key detected error code
      return res.status(400).json({message: 'Username already exists.'});
    }
    console.error('Error registering user: ', error);
    res.status(500).json({message: 'Error registering user.'});
  }

});

//handles the authentication of a user
app.post("/login", async (req, res) => {
  const { existingUsername, existingPassword } = req.body;

  try {

    const user = await userCollection.findOne({username: existingUsername});
    const hash = user.password;

    if (user) {
      const checkPassword = await bcrypt.compare(existingPassword, hash);

      if (checkPassword) {
        res.cookie('username', existingUsername, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000}); //cookie is set to expire in 24 hours
        res.status(201).json({message: 'user successfully logged in'});
      } else {
        res.status(401).json({message: 'Incorrect username or password'});
      }
    } else {
      res.status(401).json({message: 'Incorrect username or password'});
    }

  } catch (error) {
    res.status(400).json({message: 'Username does not exist'});
  }

});

app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.status(200).json({ message: 'Logged out successfully' });
});

app.put("/update", async (req, res) => {
  const { cardId, lastWatched } = req.body;

  try {
    const result = await cardCollection.updateOne(
      { _id: new ObjectId(cardId) },  // Convert cardId to ObjectId
      { $set: { 'last ep watched': lastWatched, 'date logged': getDate() } }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Card updated successfully!' });
    } else {
      res.status(404).json({ message: 'Card not found' });
    }
  } catch (error) {
    console.error('Error updating card:', error);
    res.status(500).json({ message: 'Error updating card' });
  }
});


//handles the deletion of a card
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
