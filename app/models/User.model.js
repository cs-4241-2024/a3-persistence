// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;


const userSchema = new Schema({
    "shortname": String,
    "username": String,
    "password": String,
});
const User = mongoose.model('User', userSchema)

module.exports = User;