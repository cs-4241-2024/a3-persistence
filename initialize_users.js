const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI; // Load the connection string from the .env file
const client = new MongoClient(uri);

async function initializeUsersCollection() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    // Define the database and collection
    const db = client.db("bookmark-manager"); // Replace with your database name
    const usersCollection = db.collection("users");

    // Ensure the username is unique (create index)
    await usersCollection.createIndex({ username: 1 }, { unique: true });

    // Insert initial users (password should ideally be hashed)
    await usersCollection.insertMany([
      { username: "admin", password: "admin" },
      { username: "test", password: "test" }
    ]);

    console.log("Users collection initialized successfully!");
  } catch (err) {
    console.error("Error initializing users collection:", err);
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB.");
  }
}

initializeUsersCollection();
