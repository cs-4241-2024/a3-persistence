const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

const url = 'mongodb+srv://adminthecoolbt:Ow6RyYjKZluCqCFS@cluster0.cseqv.mongodb.net/clickerGameDB?retryWrites=true&w=majority';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

let db, usersCollection, leaderboardCollection;

client.connect()
  .then(() => {
    db = client.db('clickSpeedGameDB');
    usersCollection = db.collection('users');
    leaderboardCollection = db.collection('leaderboard');
    console.log('Connected to MongoDB');
  })
  .catch(error => console.error('Error connecting to MongoDB:', error));

app.use(express.static('public'));
app.use(express.json());

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

function isAuthenticated(req, res, next) {
  if (req.session.username) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized: Please log in' });
  }
}

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await usersCollection.findOne({ username });

  if (existingUser) {
    return res.status(400).json({ error: 'Username already taken' });
  }

  await usersCollection.insertOne({ username, password: hashedPassword });
  req.session.username = username;
  res.json({ message: 'Registration successful' });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const user = await usersCollection.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  req.session.username = username;
  res.json({ message: 'Login successful' });
});

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out successfully' });
});

app.get('/leaderboard', (req, res) => {
  leaderboardCollection.find().toArray()
    .then(results => res.json(results))
    .catch(error => res.status(500).json({ error: 'Failed to fetch leaderboard data' }));
});

app.post('/leaderboard', isAuthenticated, (req, res) => {
  const { score } = req.body;

  if (!score) {
    return res.status(400).json({ error: 'Score is required' });
  }

  const newEntry = {
    username: req.session.username,
    score,
    date: new Date().toLocaleString()
  };

  leaderboardCollection.insertOne(newEntry)
    .then(() => leaderboardCollection.find().toArray())
    .then(results => res.json(results))
    .catch(error => res.status(500).json({ error: 'Failed to add leaderboard entry' }));
});

app.delete('/leaderboard', isAuthenticated, (req, res) => {
  const { score, date } = req.body;

  leaderboardCollection.deleteOne({
    username: req.session.username,
    score,
    date
  })
    .then(() => leaderboardCollection.find().toArray())
    .then(results => res.json(results))
    .catch(error => res.status(500).json({ error: 'Failed to delete leaderboard entry' }));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

