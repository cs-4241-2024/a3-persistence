// importing the required oackages
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()


const app = express();

const PORT = process.env.PORT || 3001;
// const username = process.env.USERNAME;
// const password = process.env.PASSWORD;
// const dbname = process.env.DBNAME;
// console.log(username, password, dbname);
const connectionURL = `mongodb+srv://skylerlin:flora1234@cluster0.hb0bf.mongodb.net/a3-skylerlin`;

// const connectionURL = `mongodb+srv://${username}:${password}@cluster0.hb0bf.mongodb.net/${dbname}`;

// Serve static files from 'public' and 'views'
app.use(express.static('public'));
app.use(express.static('views'));

mongoose.connect(connectionURL, {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

const orderSchema = new mongoose.Schema({
  name: String,
  address: String,
  phone: String,
  instructions: String,
  taxPrice: String,
  totalPrice: String,
  itemTotal: Number,
  orderNumber: Number,
  cashTotal: Number  
});

const Order = mongoose.model('Order', orderSchema);

// Serve index.html for root request
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Middleware for handling JSON requests
app.use(express.json());

app.post('/submit', async (req, res) => {
  try {
    const orderData = req.body;

    // Create a new order using the Order model
    const newOrder = new Order(orderData);
    await newOrder.save(); // Save the order to MongoDB

    res.status(201).json({ message: 'Order saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving order' });
  }
});

app.get('/getCart', async (req, res) => {
  try {
    const orders = await Order.find(); // Fetch all orders from MongoDB
    res.status(200).json({ cart: orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
