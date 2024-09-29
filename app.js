const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const session = require('express-session');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const dbUrl = process.env.MONGODB_URI;

let db, usersCollection, tasksCollection;

MongoClient.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) throw err;
  db = client.db('todo-app');
  usersCollection = db.collection('users');
  tasksCollection = db.collection('tasks');
  console.log('Connected to MongoDB');
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await usersCollection.findOne({ username });
    if (!user) return done(null, false, { message: 'Incorrect username' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return done(null, false, { message: 'Incorrect password' });
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "https://a3-tanishkad21.glitch.me/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await usersCollection.findOne({ githubId: profile.id });
    if (!user) {
      user = await usersCollection.insertOne({ githubId: profile.id, username: profile.username });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/index.html');
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', isLoggedIn, (req, res) => {
  res.redirect('/task-tracker.html');
});

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await usersCollection.findOne({ username });
  if (existingUser) {
    return res.redirect('/signup.html?error=user-exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await usersCollection.insertOne({ username, password: hashedPassword });
  res.redirect('/index.html');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/task-tracker.html',
  failureRedirect: '/index.html',
}));

app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/index.html' }),
  (req, res) => {
    res.redirect('/task-tracker.html');
  }
);

app.get('/tasks', isLoggedIn, async (req, res) => {
  const tasks = await tasksCollection.find({ user: req.user._id }).toArray();
  res.json(tasks);
});

app.post('/tasks', isLoggedIn, async (req, res) => {
  const taskData = { ...req.body, user: req.user._id, creationDate: new Date() };
  await tasksCollection.insertOne(taskData);
  res.json({ message: 'Task added successfully' });
});

app.delete('/tasks/:id', isLoggedIn, async (req, res) => {
  await tasksCollection.deleteOne({ _id: new ObjectId(req.params.id), user: req.user._id });
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
