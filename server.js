require('dotenv').config();

// Import MongoClient and ServerApiVersion from mongodb
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Import express, cookie-session, and express-handlebars
const express = require("express"),
                cookie = require("cookie-session"),
                hbs = require("express-handlebars").engine,
                app = express();

// Middleware to serve static files and parse JSON
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize variables to store the MongoDB connection and collection
let collection = null;
let namesCollection = null

// MongoDB connection URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.HOST}`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Connect to the MongoDB cluster
async function run(){
  conn = await client.connect();
  collection = await conn.db("GuestList").collection("authentication");
  namesCollection = await conn.db("GuestList").collection("guests");
}
run();

// cookie middleware! The keys are used for encryption and should be changed
app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge: 5 * 60 * 1000 // 5 minutes
}));

// POST request for login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body); // Debugging

  // Check if the user exists in the database
  if (collection !== null) {
    // find something that matches the username
    const user = await collection.findOne({ username: username });
    console.log(user); // Debugging

    if (user !== null) {
      if (user.password === password) {
        console.log("User logged in:", username); // Debugging
        req.session.username = username;
        req.session.login = true;
        return res.json({ success: true, message: 'User found, redirect to home' });
      } else {
        return res.json({ fail: true, message: 'Invalid password' });
      }
    } else {
      // User not found so we create a new user in the database
      await collection.insertOne({ username, password });
      console.log("New User added"); // Debugging
      req.session.username = username;
      req.session.login = true;
      return res.json({ success: true, message: 'New user added, redirect to home' });
    }
  } else {
    return res.status(500).json({ success: false, message: 'Database connection error' });
  }
});

// GET request for the protected route
app.get('/protected', (req, res) => {
  if (req.session && req.session.login) {
    res.json({ success: true, message: 'User is authenticated' });
  } else {
    res.status(401).json({ success: false, message: 'User not authenticated' });
  }
});

app.put('/editName', async (req, res) => {
  const { guest_name, newGuestName } = req.body; // Get the name from the request body
  console.log(guest_name); // Log the name for debugging

  if (namesCollection !== null) {
    // Check if the name exists in the collection
    const guest = await namesCollection.findOne({ guest_name: guest_name });
    if (guest !== null) {
      // Update the name in the collection
      const result = await namesCollection.updateOne(
        { guest_name: guest_name },
        { $set: { guest_name: newGuestName } }
      );

      if (result.modifiedCount === 1) {
        // Name successfully updated
        res.status(200).send({ message: `Successfully updated ${guest_name}`, guest_name });
      } else {
        // Name not updated
        res.status(404).send({ message: `Guest ${guest_name} could not be updated` });
      }
    } else {
      // Name not found
      res.status(404).send({ message: `Guest ${guest_name} not found` });
    }
  } else {
    res.status(500).send({ message: 'Database connection error' });
  }
});

// Middleware to check if the session is valid or expired
async function checkSession(req, res, next) {
  if (req.session && req.session.login) {
    next(); // If the session is valid, continue to the next route or middleware
  } else {
    // If session is invalid or expired, redirect to login page
    res.send('public/index.html');
  }
}

// Add session check to all protected routes
app.use(function(req, res, next) {
  checkSession(req, res, next); // Apply session check globally
});

// GET request handler for the getNames route
app.get('/getNames', async (req, res) => {
  if (namesCollection !== null){
    const names = await namesCollection.find().toArray(); // Get all names from the collection
    console.log(names);
    res.json(names); // Send the names back to the client
  } else {
    //send username to client
    res.status(500).send({ message: 'Database connection error' });
  }
});

// POST request handler for the addName route
app.post('/addName', async (req, res) => {
  const { name } = req.body; // Correct the variable name to match what the client sends
  console.log(name); // Log the name for debugging
  
  if (namesCollection !== null) {
    try {
      // Insert the name into the collection and the current session username
      const result = await namesCollection.insertOne({ guest_name: name , invited_by: req.session.username });

      if (result.insertedCount === 1) {
        // Name successfully added
        res.status(200).send({ message: `Successfully added ${name}`, name });
      } else {
        // Name not added
        res.status(404).send({ message: `Guest ${name} could not be added` });
      }
    } catch (error) {
      // Handle any errors that occur during the insert operation
      res.status(500).send({ message: 'Database error', error });
    }
  } else {
    res.status(500).send({ message: 'Database connection error' });
  }
});

// delete request handler for the deleteName route
app.delete('/deleteName', async (req, res) => {
  const { guest_name } = req.body; // Get the name from the request body
  
  if (namesCollection !== null) {
    
    
    //Check if session username is the same as the invited_by if not do not delete
    const guest = await namesCollection.findOne({ guest_name: guest_name });
    if (guest.invited_by !== req.session.username) {
      res.status(401).send({ message: 'Unauthorized' });
      return;
    } else {
    // delete from db
        const guest = await namesCollection.deleteOne({ guest_name: guest_name });
    }


    // Check if the name was deleted
    if (guest.deletedCount === 1) {
      // Name successfully deleted
      res.status(200).send({ message: `Successfully deleted ${guest_name}`, guest_name });
    } else {
      // Name not found or not deleted
      res.status(404).send({ message: `Guest ${guest_name} not found` });
    }
  } else {
    res.status(500).send({ message: 'Database error' });
  }
});

function checkSession(req, res, next) {
  if (req.session && req.session.login) {
    next(); // Session is valid, continue to the next middleware or route
  } else {
    // Session is invalid, redirect to index.html
    req.session.login = false;
    res.send('/index.html');
  }
}

// Start Express server and listen on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});