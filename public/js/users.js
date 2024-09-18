const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let usersCollection;

async function connectToDatabase() {
    try {
        await client.connect();
        const database = client.db('todoApp');
        usersCollection = database.collection('users');
        console.log("Connected to MongoDB!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

connectToDatabase();

async function registerUser(username, password) {
    try {

        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            throw new Error('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await usersCollection.insertOne({ username, password: hashedPassword });
        return result.insertedId;
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
}

async function authenticateUser(username, password) {
    try {
        const user = await usersCollection.findOne({ username });
        if (!user) return null;
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return null;

        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return token;
    } catch (error) {
        console.error("Error authenticating user:", error);
        throw error;
    }
}


module.exports = { registerUser, authenticateUser };
