const {mongoose} = require('mongoose');

const {Schema} = mongoose;

const scoreSchema = new Schema({
    name: String,
    date: Date,
    points: String,
    rank: Number

});
const Score = mongoose.model('Score', scoreSchema)

module.exports = Score;