const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Score = new Schema({
    objectId: ObjectId,
    name: String,
    points: String,
    rank: Number,
    date: Date
});