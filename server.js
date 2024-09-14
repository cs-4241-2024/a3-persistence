const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect('mongodb+srv://ubervenx:nbajam123@foodorders.lhc94.mongodb.net/?retryWrites=true&w=majority&appName=FoodOrders', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  foodName: { type: String, required: true },
  foodPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const Order = mongoose.model('Order', orderSchema);

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// GET request to fetch all orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
});

// POST request to create a new order
app.post('/submit', async (req, res) => {
  try {
    const { name, foodName, foodPrice, quantity } = req.body;
    const newOrder = new Order({ name, foodName, foodPrice, quantity });
    await newOrder.save();
    res.status(200).json({ message: 'Order created', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
});

// PUT request to update an existing order
app.put('/edit', async (req, res) => {
  const { id, name, foodName, foodPrice, quantity } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(id, { name, foodName, foodPrice, quantity }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error });
  }
});

// DELETE request to delete an order
app.delete('/delete', async (req, res) => {
  const { id } = req.body;
  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted', deletedOrder });
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
