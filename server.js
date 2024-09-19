require('dotenv').config();
const express = require("express"),
  { MongoClient, ObjectId } = require("mongodb");
const path = require('path');
const session = require('express-session');
`mongodb+srv://${process.env.USERNAME}:${process.env.PASS}@${process.env.HOST}`
const { auth } = require('express-openid-connect');
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER
};

app = express()
const dir = 'public/';
const port = 3000;
app.use(express.json());
app.use(express.static(dir));
const store = new MongoDBStore({
  uri: `mongodb+srv://${process.env.USERNAME}:${process.env.PASS}@${process.env.HOST}`, // Replace with your MongoDB URI from the environment variables
  collection: 'sessions'
});

store.on('error', function (error) {
  console.log('Session store error:', error);
});
app.use(
  session({
    secret: process.env.SECRET, // Ensure this is a strong secret from the environment variables
    resave: false,
    saveUninitialized: false,
    store: store, // Use MongoDB for session storage
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Secure cookie only in production (HTTPS)
      maxAge: 24 * 60 * 60 * 1000 // 1 day expiration
    }
  })
);

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

app.use(auth(config));

const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient(uri)
let collection = null

async function run() {
  try {
    await client.connect()
    collection = await client.db("cs4241").collection("assignment3")
  } catch (e) {
    console.error(`Error connecting to MongoDB: ${e}`)
  }
}
run()

app.get('/', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.redirect('/login');  // Redirect to login if not authenticated
  }
});

// route to get all docs
app.get('/test', (req, res) => {
  res.send('Test route is working');
});

app.get("/docs", async (req, res) => {
  try {
    if (collection !== null) {
      const docs = await collection.find({}).toArray();
      res.json(docs);
    } else {
      res.status(500).json({ message: "No collection available" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch documents" });
  }
})

app.post('/add', async (req, res) => {
  try {
    const result = await collection.insertOne(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to add document" });
  }
})

app.get('/login', (req, res) => {
  res.oidc.login({
    returnTo: '/',  // Redirect users to home after login
    authorizationParams: {
      screen_hint: 'login'  // Force the login screen
    }
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Failed to destroy session during logout:', err);
    }

    res.oidc.logout({
      returnTo: '/login',  // Redirect users to the home page after logout
    });
  });
});

app.get('/auth-check', (req, res) => {
  const isAuthenticated = req.oidc.isAuthenticated();
  const user = req.oidc.user || null;  // Return user if authenticated, otherwise null
  if (user) {
    console.log(user);
  }
  res.json({ isAuthenticated, user });
});

app.get('/scores', async (req, res) => {
  try {
    if (collection !== null) {
      const docs = await collection.find({}).toArray();
      res.json({ scores: docs });
    } else {
      res.status(500).json({ message: "No collection available" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

app.post('/reset-score', async (req, res) => {
  try {
    await collection.deleteMany({});
    res.status(200).json({ message: 'Score reset successfully' });
  } catch (error) {
    res.status(500).json({ error: "Failed to reset scores" });
  }
});

app.post('/save-score', async (req, res) => {
  const { name, score, duration } = req.body;
  try {
    const result = await collection.insertOne({ name, score, time: duration });
    console.log(result)
    res.status(200).json({ message: 'Score saved successfully' });
  } catch (error) {
    res.status(500).json({ error: "Failed to add document" });
  }
});

app.put('/update-name/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(id) }, // Find the document by ID
      { $set: { name: name } }   // Update only the name field
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Name updated successfully' });
    } else {
      res.status(404).json({ message: 'No document found with that ID' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update name' });
  }
});

app.delete('/delete-score/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'Score deleted successfully' });
    } else {
      res.status(404).json({ message: 'No document found with that ID' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete score' });
  }
});

app.post('/save-name', (req, res) => {
  const data = req.body;
  const name = data.name;

  res.status(200).json({ message: 'Name saved successfully' });
});

app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.listen(process.env.PORT || port, () => {
  console.log(`Server is running on port ${port}`);
});

process.on('SIGINT', async () => {
  await client.close();
  console.log("MongoDB connection closed");
  process.exit(0);
});