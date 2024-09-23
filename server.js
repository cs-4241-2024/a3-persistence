//Middle-ware used: Cookie-session, handlebars
const express = require('express');
const cookie = require( 'cookie-session' );
const hbs = require( 'express-handlebars').engine;
//const fs = require('fs');
//const mime = require('mime');
const path = require('path');
const app = express();
const port = 3000;

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = "mongodb+srv://jmsmith2:testingwizard456@assignment3-database.oiv2l.mongodb.net/?retryWrites=true&w=majority&appName=Assignment3-Database"

//MongoDB Client Initializaiton
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const userAccounts = [
  { username: 'JohnD2020', password: 'tester456' },
  { username: 'Wizard4600', password: 'ShaneZ55' },
  { username: 'XYZ123', password: 'JD2600' },
]

//Run database
let collectionLogins = null;
let collectionUsers = null;

async function run() {
  try {
    await client.connect();
    // Separate user data and logins
    collectionLogins = await client.db('EmployeeDB').collection('Logins');
    collectionUsers = await client.db('EmployeeDB').collection('Users');
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run().catch(console.dir);


// Express.js middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session cookies middleware for user login
app.use(cookie({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge: 24 * 60 * 60 * 1000, // Expires after 1 day
}));

// Check login
function requireLogin(req, res, next) {
  if (!req.session.username) {
    return res.redirect('/login');
  }
  next();
}

// Serve login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Handle login request
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user in MongoDB
    const user = await collectionLogins.findOne({ username: username, password: password });

    if (user) {
      req.session.username = user.username; // Store username in session
      res.redirect('/'); // Redirect to index page
    } else {
      res.redirect('/login?error=Invalid username or password');
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send('Server error during login');
  }
});

//Access index.html on login
app.get('/', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//Access public folder
app.use(express.static('public'));

// Fetch employee data (protected route)
app.get('/data', requireLogin, async (req, res) => {
  try {
    const username = req.session.username; // Retrieve logged-in username

    if (collectionUsers !== null) {
      // Fetch only data for the logged-in user
      const userData = await collectionUsers.find({ username: username }).toArray();
      res.status(200).json(userData);
    } else {
      res.status(500).send('No MongoDB collection found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data');
  }
});

// Fetch documents from MongoDB (protected route)
app.get('/docs', requireLogin, async (req, res) => {
  if (collectionUsers !== null) {
    const docs = await collectionUsers.find({}).toArray();
    console.log(docs);
    res.json(docs);
  } else {
    res.status(500).send('No MongoDB collection found');
  }
});

// Submit new employee data (protected route)
app.post('/submit', requireLogin, async (req, res) => {
  const newData = req.body;
  const newEntry = {
    employeeid: newData.employeeid,
    name: newData.name, // Ensure you're using the correct property
    salary: newData.salary,
    regdate: newData.regdate,
    expdate: parseInt(newData.regdate) + 5,
    username: req.session.username // Associate employee data with logged-in user
  };

  try {
    if (collectionUsers !== null) {
      const result = await collectionUsers.insertOne(newEntry);
      console.log('New employee inserted:', result);
      const updatedData = await collectionUsers.find({ username: req.session.username }).toArray(); // Fetch user-specific data
      res.status(200).json(updatedData);
    } else {
      res.status(500).send('No MongoDB collection found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error inserting data');
  }
});

// Edit employee data by index (protected route)
app.put('/edit/:employeeid', requireLogin, async (req, res) => {
  const employeeid = req.params.employeeid;
  const updatedData = req.body;

  try {
    if (collectionUsers !== null) {
      // Ensure the record belongs to the logged-in user
      const result = await collectionUsers.updateOne(
        { employeeid: employeeid, username: req.session.username }, // Match both employeeid and username
        {
          $set: {
            name: updatedData.name,
            salary: updatedData.salary,
            regdate: updatedData.regdate,
            expdate: parseInt(updatedData.regdate) + 5
          }
        }
      );

      if (result.modifiedCount === 1) {
        const updatedDataList = await collectionUsers.find({ username: req.session.username }).toArray();
        res.status(200).json(updatedDataList);
      } else {
        res.status(404).send('Employee not found or no changes made');
      }
    } else {
      res.status(500).send('No MongoDB collection found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating data');
  }
});

// Delete employee data by index (protected route)
app.delete('/delete/:employeeid', requireLogin, async (req, res) => {
  const employeeid = req.params.employeeid;
  const username = req.session.username;

  try {
    if (collectionUsers !== null) {
      const result = await collectionUsers.deleteOne({ employeeid: employeeid, username: username });
      
      if (result.deletedCount === 1) {
        const updatedData = await collectionUsers.find({ username: username }).toArray(); // Fetch remaining user-specific data
        res.status(200).json(updatedData);
      } else {
        res.status(404).send('Employee not found');
      }
    } else {
      res.status(500).send('No MongoDB collection found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting data');
  }
});

// Handle logout
app.post('/logout', (req, res) => {
  req.session = null; // Destroy the session
  res.redirect('/login'); // Redirect to the login page
});

// Handle logout
app.post('/logout', (req, res) => {
  req.session = null; // Destroy the session
  res.redirect('/login'); // Redirect to the login page
});

// Start the server
app.listen(process.env.PORT || port, () => {
  console.log(`Server is running on port ${port}`);
});