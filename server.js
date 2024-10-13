const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');  
const app = express();
const port = process.env.PORT || 3000;

const dbURI = 'mongodb+srv://jaisouffle:belikewater333@cluster0.o9sru.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Error connecting to MongoDB Atlas:', err));

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(session({
  secret: 'secret-key', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

// mongoose schema
const carSchema = new mongoose.Schema({
  model: String,
  year: Number,
  mpg: Number,
  age: Number
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  cars: [carSchema] 
});

const User = mongoose.model('User', userSchema);

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  let user = await User.findOne({ username });

  if (!user) {
    user = new User({ username, password, cars: [] });
    await user.save();
    req.session.userId = user._id;  
    res.json({ message: 'New user created', user });
  } else if (user.password === password) {
    req.session.userId = user._id;  
    res.json({ message: 'Login successful', user });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to log out' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

app.get('/app', (req, res) => {
  if (req.session.userId) {
    res.sendFile(__dirname + '/public/index.html');
  } else {
    res.redirect('/login');
  }
});

app.post('/submit', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { model, year, mpg, action, index } = req.body;
  const age = new Date().getFullYear() - year;

  const user = await User.findById(req.session.userId);

  if (action === 'add') {
    user.cars.push({ model, year, mpg, age });
  } else if (action === 'edit') {
    user.cars[index] = { model, year, mpg, age };
  }

  await user.save();
  res.json(user.cars);
});

app.post('/delete', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { index } = req.body;
  const user = await User.findById(req.session.userId);

  user.cars.splice(index, 1); 
  await user.save();

  res.json(user.cars);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
