const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;
const secretKey = 'your-secret-key'; // Use a secure key for JWT

// MongoDB connection URI and Database
const uri = 'mongodb+srv://ubervenx:nbajam123@foodorders.lhc94.mongodb.net/?retryWrites=true&w=majority&appName=FoodOrders';
const client = new MongoClient(uri);
const dbName = 'foodordersDB';
const collectionName = 'orders';
const usersCollectionName = 'users';

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));

// Connect to MongoDB

let db, ordersCollection, usersCollection;
client.connect().then(() => {
  db = client.db(dbName);
  ordersCollection = db.collection(collectionName);
  usersCollection = db.collection(usersCollectionName); // Users collection
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});


// Connect to MongoDB
/*
async function getOrders(){
  const orders = await client.db(dbName).collection(collectionName);
  console.log("Hello 2")
}

let ordersCollection = getOrders;
*/
// GET request to fetch all orders
app.get('/orders', async (req, res) => {
  console.log("Hello!")
  try {
    const orders = await ordersCollection.find().toArray();
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
});

// POST request to create a new order
app.post('/submit', async (req, res) => {
  try {
    const { name, foodName, foodPrice, quantity } = req.body;
    const newOrder = { name, foodName, foodPrice, quantity };
    const result = await ordersCollection.insertOne(newOrder);
    const orderWithId = { ...newOrder, _id: result.insertedId };
    res.status(200).json({ message: 'Order created', order: orderWithId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
});

// PUT request to update an existing order
app.put('/edit', async (req, res) => {
  const { id, name, foodName, foodPrice, quantity } = req.body;
  try {
    const result = await ordersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { name, foodName, foodPrice, quantity } }
    );
    if (result.matchedCount === 0) return res.status(404).json({ message: 'Order not found' });
    const updatedOrder = { _id: id, name, foodName, foodPrice, quantity };
    res.json({ message: 'Order updated', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error });
  }
});

// DELETE request to delete an order
app.delete('/delete', async (req, res) => {
  const { id } = req.body;
  try {
    const result = await ordersCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error });
  }
});

// User Registration Route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const newUser = { username, password: hashedPassword };
    await usersCollection.insertOne(newUser);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// User Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await usersCollection.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare the password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Serve static files (HTML, CSS, JS)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
