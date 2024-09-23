require('dotenv').config();
const express = require("express"),
      { MongoClient, ObjectId } = require("mongodb"),
      app = express(),
      session = require('express-session');


app.use(session({
  secret: 'secret-key', 
  resave: false, 
  saveUninitialized: true, 
  cookie: { secure: false } 
}));


// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());



// MongoDB connection setup
const uri = `mongodb+srv://${process.env.USER_A3}:${process.env.PASSWORD}@cluster0.5hgmv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri);

let workoutCollection = null;
let usersCollection = null;

async function run() {
  await client.connect();
  workoutCollection = await client.db("A3").collection("workoutData");
  usersCollection = await client.db("A3").collection("Users");
}

run();

// Protect the home page by requiring login
app.get('/home', (req, res) => {
  console.log('is this even working')
  console.log('Session:', req.session);  // Log session data
  if (req.session.login) {
    res.redirect('/public/home.html')
  } else {
    res.redirect('/');  // Redirect to the login page
  }
});

app.get('/logout', (req, res) => {
  console.log('Session destroyed:', req.session);  // Log session after destruction
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/home.html');  // If there's an error, stay on home page
    }
    res.clearCookie('connect.sid');  // Clear the session cookie
    res.redirect('/');  // Redirect to the login page after logging out
  });
});


app.get("/docs", async (req, res) => {
  if (workoutCollection !== null) {
    const docs = await workoutCollection.find({username: req.session.username}).toArray();
    res.json(docs);
  }
});


app.post( '/login', async (req,res)=> {

  console.log(req.body)
  const username = req.body.username;
  const password = req.body.password;
  
  try {
    // Check if the user exists in the Users collection
    const user = await usersCollection.findOne({ username: username });

    if (user) {
      // Check if the provided password matches
      if (user.password === password) {
        // Login successful
        req.session.login = true;
        req.session.username = username;  // Store the username in session
        
        // Redirect to home page after successful login
        res.redirect('home.html');
      } else {
        // Password incorrect
        res.redirect('index.html');
      }
    } else {
       // User does not exist, create a new user with provided credentials
       const newUser = { username: username, password: password };
       await usersCollection.insertOne(newUser);
 
       // Log the new user in
       req.session.login = true;
       req.session.username = username;  // Store the username in session

       res.redirect('home.html');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal server error');
  }
})


app.post('/submit', async (req, res) => {
  const parsed = req.body;

  parsed.sets = parseInt(parsed.sets);
  parsed.reps = parseInt(parsed.reps);
  parsed.weight = parseInt(parsed.weight)
  parsed.total = parsed.sets * parsed.reps * parsed.weight;  

  parsed.username = req.session.username;  
  console.log('This is parsed '+JSON.stringify(parsed))

  if (workoutCollection !== null) {
    await workoutCollection.insertOne(parsed);
    const docs = await workoutCollection.find({username: req.session.username}).toArray();  
    res.json(docs);
  }
});


app.post('/clear', async (req, res) => {
  if (workoutCollection !== null) {
    await workoutCollection.deleteMany({username: req.session.username});  
    res.json({ data: [] });  
  }
});


app.post('/delete', async (req, res) => {
  const { index } = req.body;

  if (workoutCollection !== null) {
    const docs = await workoutCollection.find({username: req.session.username}).toArray();
    const docToDelete = docs[index];

    if (docToDelete) {
      await workoutCollection.deleteOne({ _id: docToDelete._id });  
      const updatedDocs = await workoutCollection.find({username: req.session.username}).toArray();  
      res.json(updatedDocs);
    } else {
      res.status(404).send('Document not found');
    }
  }
});

app.post('/update', async (req, res) => {
  const { id, updatedData } = req.body;  

  updatedData.sets = parseInt(updatedData.sets);
  updatedData.reps = parseInt(updatedData.reps);
  updatedData.weight = parseInt(updatedData.weight);
  updatedData.total = updatedData.sets * updatedData.reps * updatedData.weight;

  if (workoutCollection !== null) {
    await workoutCollection.updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
    const docs = await workoutCollection.find({username: req.session.username}).toArray();
    res.json(docs);
  }
});


// Start the Express server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
