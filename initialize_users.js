const { MongoClient } = require("mongodb");
require("dotenv").config();

var bcrypt = require("bcryptjs"); //to encrypt passwords

const { connect, disconnect, getDB } = require("./db");


async function initializeUsersCollection() {
  try {

    // Define the database and collection
    const db = await connect()
    const usersCollection = db.collection("users");

    // Ensure the username is unique (create index)
    await usersCollection.createIndex({ username: 1 }, { unique: true });

    // Insert initial users (password should ideally be hashed)

    const adminPass = await bcrypt.hash("admin", 10);
    const testPass = await bcrypt.hash("test", 10);

    const pairs = [
      {username: "admin", password: adminPass}, 
      {username: "test", password: testPass}]
    console.log(pairs);
    await usersCollection.insertMany(pairs);

    console.log("Users collection initialized successfully!");
  } catch (err) {
    console.error("Error initializing users collection:", err);
  } finally {
    disconnect();
  }
}

initializeUsersCollection();
