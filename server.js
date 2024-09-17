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
  }
});

//Run database
let collection = null;
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    collection = await client.db('EmployeeDB').collection('Users');
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

let appdata = [
  { 'employeeid': '123456789', 'name': 'John Doe', 'salary': 57000, 'regdate': 2021, 'expdate': 2026 },
  { 'employeeid': '987563409', 'name': 'Jack Smith', 'salary': 75000, 'regdate': 2019, 'expdate': 2024 },
  { 'employeeid': '456891237', 'name': 'Jane Lee', 'salary': 90000, 'regdate': 2020, 'expdate': 2025 }
];


// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session cookies middleware for user login
app.use(cookie({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// Middleware to protect routes and check for login
function requireLogin(req, res, next) {
  if (!req.session.login) {
    return res.redirect('/login'); // Redirect to login if not authenticated
  }
  next();
}

// Serve login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Handle login request
app.post('/login', (req, res) => {
  console.log(req.body);

  if (req.body.password === 'wizard') {
    req.session.login = true; // Set session login flag
    res.redirect('/'); // Redirect to the index.html
  } else {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  }
});

//Access index.html on login
app.get('/', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//Access public folder
app.use(express.static('public'));

// Fetch employee data (protected route)
app.get('/data', requireLogin, (req, res) => {
  res.status(200).json(appdata);
});

// Fetch documents from MongoDB (protected route)
app.get('/docs', requireLogin, async (req, res) => {
  if (collection !== null) {
    const docs = await collection.find({}).toArray();
    console.log(docs);
    res.json(docs);
  } else {
    res.status(500).send('No MongoDB collection found');
  }
});

// Submit new employee data (protected route)
app.post('/submit', requireLogin, (req, res) => {
  const newData = req.body;
  const newEntry = {
    employeeid: newData.employeeid,
    name: newData.yourname,
    salary: newData.salary,
    regdate: newData.regdate,
    expdate: parseInt(newData.regdate) + 5
  };

  appdata.push(newEntry);
  res.status(200).json(appdata);
});

// Edit employee data by index (protected route)
app.put('/edit/:index', requireLogin, (req, res) => {
  const index = parseInt(req.params.index);
  const updatedData = req.body;

  if (index >= 0 && index < appdata.length) {
    appdata[index] = {
      employeeid: updatedData.employeeid,
      name: updatedData.name,
      salary: updatedData.salary,
      regdate: updatedData.regdate,
      expdate: parseInt(updatedData.regdate) + 5
    };
    res.status(200).json(appdata);
  } else {
    res.status(400).send('Invalid index');
  }
});

// Delete employee data by index (protected route)
app.delete('/delete/:index', requireLogin, (req, res) => {
  const index = parseInt(req.params.index);

  if (index >= 0 && index < appdata.length) {
    appdata.splice(index, 1);
    res.status(200).json(appdata);
  } else {
    res.status(400).send('Invalid index');
  }
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