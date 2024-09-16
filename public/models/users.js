const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const uri = process.env.MONGODB_URI; // Use environment variable for URI
const client = new MongoClient(uri);

let usersCollection;

// Connect to the database
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

// Call connectToDatabase
connectToDatabase();

// Register a new user
async function registerUser(username, password) {
    try {
        // Check if the username already exists
        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            throw new Error('Username already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user
        const result = await usersCollection.insertOne({ username, password: hashedPassword });
        return result.insertedId;
    } catch (error) {
        console.error("Error registering user:", error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

// Authenticate a user and return a JWT token
async function authenticateUser(username, password) {
    try {
        // Find the user
        const user = await usersCollection.findOne({ username });
        if (!user) return null;

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return null;

        // Generate a JWT token
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return token;
    } catch (error) {
        console.error("Error authenticating user:", error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

// Export the functions
module.exports = { registerUser, authenticateUser };
