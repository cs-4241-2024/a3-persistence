const express = require('express');
const session = require('express-session');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

const uri = 'mongodb+srv://jjariwala:<db_password>@a3.8rvei.mongodb.net';
const client = new MongoClient(uri);

let db, usersCollection, entriesCollection;

client.connect().then(() => {
  db = client.db('journalDB');
  usersCollection = db.collection('users');
  entriesCollection = db.collection('entries');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await usersCollection.findOne({ email, password });
  
  if (user) {
    req.session.user = user;
    res.redirect('/index.html');
  } else {
    res.status(401).send('Invalid credentials');
  }
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const newUser = { name, email, password };
  await usersCollection.insertOne(newUser);
  req.session.user = newUser;
  res.redirect('/index.html');
});

app.get('/entries', async (req, res) => {
  if (!req.session.user) return res.status(403).send('Unauthorized');
  const entries = await entriesCollection.find({ userId: req.session.user._id }).toArray();
  res.json(entries);
});

app.post('/addEntry', async (req, res) => {
  const { title, date, time, entry } = req.body;
  const newEntry = { title, date, time, entry, userId: req.session.user._id };
  const result = await entriesCollection.insertOne(newEntry);
  res.json(result.ops[0]);
});

app.delete('/deleteEntry/:id', async (req, res) => {
  await entriesCollection.deleteOne({ _id: ObjectId(req.params.id) });
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://www.example.com/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

// Serialize and deserialize user instances to and from the session.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Google OAuth routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

