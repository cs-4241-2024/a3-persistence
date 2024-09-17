const {mongoose} = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const scoreSchema = new Schema({
    objectId: ObjectId,
    name: String,
    points: String,
    rank: Number,
    date: Date
});
const Score = mongoose.model('Score', scoreSchema)

module.exports = Score;