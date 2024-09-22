const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');

// Assuming you have the Order model
const Order = require('../models/order');
const User = require('../models/user');

router.post('/submit', ensureAuthenticated, async (req, res) => {
    //   router.post('/submit', async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: 'You need to be logged in to place an order.' });
        }
        console.log(req.body)
        console.log(req.user, "user")
        const orderData = req.body;
        const newOrder = new Order(orderData);
        await newOrder.save(); // Save the order to MongoDB

        // Find the logged-in user and add the order to their orders list
        const user = await User.findById(req.user._id);
        user.orders.push(newOrder._id);
        await user.save();

        res.status(201).json({ message: 'Order saved successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error saving order' });
    }
});


router.get('/getCart', async (req, res) => {
    try {
        const orders = await Order.find(); // Fetch all orders from MongoDB
        res.status(200).json({ cart: orders });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

router.get('/my-orders', ensureAuthenticated, async (req, res) => {
    try {
        // Find the user and populate their orders
        const user = await User.findById(req.user._id).populate('orders');
        res.status(200).json({ orders: user.orders });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

// Update an order by ID
router.put('/update/:id', ensureAuthenticated, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating order' });
    }
});


// Delete an order by ID
router.delete('/delete/:id', ensureAuthenticated, async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        // Optionally, remove order from user's order list
        const user = await User.findById(req.user._id);
        user.orders.pull(deletedOrder._id);
        await user.save();

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting order' });
    }
});



module.exports = router; 