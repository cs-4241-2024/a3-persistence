import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from './models/user.js';
import connectDB from './db.js';
import cors from 'cors';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
const port = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';


app.use(express.json());
app.use(express.static('public'));

app.use(cors({
  origin: 'http://localhost:3001',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
}));


connectDB()
    .then(() => {
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    })
    .catch((error) => {
      console.error('Failed to connect to MongoDB', error);
      process.exit(1);
    });



app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/public/auth.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/auth.html');
});


app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({ email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Signup successful', token });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

  res.json({ message: 'Login successful', token });
});

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access denied, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

app.get('/vehicles', authenticate, async (req, res) => {
  console.log('Token:', token);

  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user.modelData);
});


app.post('/vehicles', authenticate, async (req, res) => {
  const { model, year, mpg } = req.body;

  const user = await User.findById(req.userId);
  user.modelData.push({ model, year, mpg });

  await user.save();
  res.json(user.modelData);
});

app.put('/vehicles', authenticate, async (req, res) => {
  const { oldModel, model, year, mpg } = req.body;

  const user = await User.findById(req.userId);
  user.modelData = user.modelData.map(vehicle =>
      vehicle.model === oldModel ? { model, year, mpg } : vehicle
  );

  await user.save();
  res.json(user.modelData);
});

app.delete('/vehicles', authenticate, async (req, res) => {
  const { model } = req.body;

  const user = await User.findById(req.userId);
  user.modelData = user.modelData.filter(vehicle => vehicle.model !== model);

  await user.save();
  res.json(user.modelData);
});
