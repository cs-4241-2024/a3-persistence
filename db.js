const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_URI; // Get the MongoDB URI from environment variables

const databaseName = "bookmark-manager";

let client;
let db;

async function connect() {
  if (client && client.topology && client.topology.isConnected()) {
    console.log("Already connected to MongoDB");
    return db; // Return the existing database instance
  }

  try {
    // Connection URI and client setup using connection string from .env
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(databaseName);

    console.log("Connected to MongoDB!");
    return db;
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    //throw err; // Rethrow the error so the caller can handle it
  }
}

async function disconnect() {
  console.log("Closing MongoDB connection");
  await client.close();
}

function getDB() {
  return db; // Return the connected db object for use elsewhere
}

module.exports = { connect, disconnect, getDB };
