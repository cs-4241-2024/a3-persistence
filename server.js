const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// MongoDB connection URI and Database
const uri = 'mongodb+srv://ubervenx:nbajam123@foodorders.lhc94.mongodb.net/?retryWrites=true&w=majority&appName=FoodOrders';
const client = new MongoClient(uri);
const dbName = 'foodordersDB';
const collectionName = 'orders';

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));

// Connect to MongoDB

let db, ordersCollection;
client.connect().then(() => {
  db = client.db(dbName);
  ordersCollection = db.collection(collectionName);
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

// Serve static files (HTML, CSS, JS)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
