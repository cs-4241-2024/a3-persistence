const mongoose = require("mongoose");

const sushiSchema = new mongoose.Schema({
    dream: {
        type: String,
        required: true
    }
})

const Sushi = mongoose.model('Sushi', sushiSchema);
module.exports = Sushi;

