const express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
require("dotenv").config();

const session = require('express-session');

const { MongoClient } = require("mongodb");

const app = express();

// middleware

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


// Mount the indexRouter at the root path, prefix routes with /
app.use(indexRouter);


app.use(session({
  secret: 'trajanA3PersistenceSuperSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Connection URI and client setup using connection string from .env
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const databaseName = "bookmark-manager";
const usersCollectionName = "users";

// Connect to the database
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}

connectToDatabase();

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const db = client.db(databaseName); // Replace with your database name
    const usersCollection = db.collection(usersCollectionName);

    // Check if the user exists
    const existingUser = await usersCollection.findOne({ username });

    if (existingUser) {
      // User exists, validate the password
      if (existingUser.password === password) {

        // Storing user data in session
        req.session.user = existingUser;

        console.log("Authentication successful, redirecting to bookmarks.");

        return res.json({
          message: "Login successful.",
          isNewUser: false,
          redirectTo: "/bookmarks",
        });

      } else {
        return res.status(401).json({ message: "Invalid password." });
      }

    } else {
      // User does not exist, add to the database
      await usersCollection.insertOne({ username, password });

      // Set user info in session for new user
      req.session.user = { username, password};

      console.log("New user added, redirecting to bookmarks.");

      return res.json({
        message: "New user created successfully.",
        isNewUser: true, // new user!
        redirectTo: "/bookmarks",
      });
    }
  } catch (err) {
    console.error("Error handling login:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.get("/bookmarks", function (req, res) {
  if (!req.session.user) {
    return res.redirect("/login"); // Redirect to login if not authenticated
  }
  res.sendFile(path.join(__dirname, "../public/bookmarks.html"));
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

process.on("SIGINT", async () => {
  console.log("Closing MongoDB connection");
  await client.close();
  process.exit(0);
});

module.exports = app;
