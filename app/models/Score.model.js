// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;


const scoreSchema = new Schema({
    "name": String,
    "date": Date,
    "points": String,
    "rank": Number
});
const Score = mongoose.model('Score', scoreSchema)

module.exports = Score;