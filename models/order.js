const { mongoose } = require("mongoose");

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
module.exports = Order;
