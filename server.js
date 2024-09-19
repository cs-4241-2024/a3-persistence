require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, sameSite: 'lax' }
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.log("MongoDB connection error: ", error);
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String },
  githubId: { type: String, unique: true }
});

const User = mongoose.model('User', userSchema);

const taskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  priority: { type: String, required: true },
  dueDate: { type: Date, required: true },
  urgency: { type: Number, required: true }
});

const Task = mongoose.model('Task', taskSchema);

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      let user = await User.findOne({ githubId: profile.id });
      if (!user) {
        user = new User({
          githubId: profile.id,
          username: profile.username,
        });
        await user.save();
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

const checkLogin = (req, res, next) => {
  if (req.isAuthenticated() || (req.session && req.session.loggedIn && req.session.username)) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized, please log in.' });
  }
};

app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  }
);

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && user.password === password) {
      req.session.loggedIn = true;
      req.session.username = username;
      res.status(200).json({ message: 'Login successful!' });
    } else {
      res.status(401).json({ message: 'Invalid username or password.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error during login.' });
  }
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists.' });
    }
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error during registration.' });
  }
});

app.get('/check-session', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ loggedIn: true, username: req.user.username });
  } else if (req.session && req.session.loggedIn) {
    res.status(200).json({ loggedIn: true, username: req.session.username });
  } else {
    res.status(401).json({ loggedIn: false });
  }
});

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).json({ message: 'Error during logout.' });
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ message: 'Error destroying session.' });
      }
      res.status(200).json({ message: 'Logged out successfully.' });
    });
  });
});

app.get('/tasks', checkLogin, async (req, res) => {
  try {
    const tasks = await Task.find({});
    const formattedTasks = tasks.map(task => ({
      _id: task._id,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate.toISOString().split('T')[0],
      urgency: task.urgency
    }));
    res.status(200).json(formattedTasks);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error loading tasks" });
  }
});

app.post('/tasks', checkLogin, async (req, res) => {
  try {
    const { description, priority, dueDate } = req.body;
    const urgency = calculateUrgencyForTask({ priority, dueDate });
    const newTask = new Task({
      description,
      priority,
      dueDate,
      urgency
    });
    const savedTask = await newTask.save();
    res.status(201).json({
      id: savedTask._id,
      description: savedTask.description,
      priority: savedTask.priority,
      dueDate: savedTask.dueDate,
      urgency: savedTask.urgency
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error saving task" });
  }
});

app.put('/tasks/:id', checkLogin, async (req, res) => {
  try {
    const taskId = req.params.id;
    const updatedTaskData = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        description: updatedTaskData.description,
        priority: updatedTaskData.priority,
        dueDate: new Date(updatedTaskData.dueDate),
        urgency: calculateUrgencyForTask(updatedTaskData)
      },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating task" });
  }
});

app.delete('/tasks/:id', checkLogin, async (req, res) => {
  try {
    const taskId = req.params.id;
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting task" });
  }
});

const calculateUrgencyForTask = (task) => {
  let urgency = 0;
  if (task.priority === 'High') {
    urgency += 5;
  } else if (task.priority === 'Medium') {
    urgency += 3;
  } else if (task.priority === 'Low') {
    urgency += 1;
  }
  const currentDate = new Date();
  const dueDate = new Date(task.dueDate);
  if (isNaN(dueDate.getTime())) {
    throw new Error('Invalid dueDate format');
  }
  const timeDiff = (dueDate - currentDate) / (1000 * 60 * 60 * 24);
  if (timeDiff <= 2) {
    urgency += 5;
  } else if (timeDiff <= 7) {
    urgency += 2;
  } else {
    urgency += 1;
  }
  return Number(urgency);
};

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
