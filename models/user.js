const { mongoose } = require("mongoose");

// Define the User schema
const userSchema = new mongoose.Schema({
    githubId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: String,
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order' // Reference to the Order model
        }
    ]
});

const User = mongoose.model('User', userSchema);
module.exports = User;