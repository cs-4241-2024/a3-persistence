const express = require("express");
const router = express.Router();
const path = require("path");

var bcrypt = require("bcryptjs"); //to encrypt passwords

const { connect, disconnect, getDB } = require("../db");


const usersCollectionName = "users";

/* GET home page. */
router.get("/", function (req, res, next) {
  res.sendFile(path.join(__dirname, "../public/index.html")); // Adjust the path as necessary
});

router.get("/bookmarks", function (req, res, next) {
  res.sendFile(path.join(__dirname, "../public/bookmarks.html")); // Adjust the path as necessary
});

// POST /login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const db = await connect();
    const usersCollection = db.collection(usersCollectionName);

    // Check if the user exists
    const existingUser = await usersCollection.findOne({ username });

    if (existingUser) {
      const passwordMatch = await bcrypt.compare(password, existingUser.password);
      if (passwordMatch) {
        req.session.user = existingUser; // Save user in session
        return res.json({
          message: "Login successful.",
          isNewUser: false,
          redirectTo: "/bookmarks", // Redirect on successful login
        });
      } else {
        return res.status(401).json({ message: "Invalid password." });
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      // User does not exist, add to the database
      await usersCollection.insertOne({ username, password: hashedPassword });

      // Set user info in session for new user
      req.session.user = {username, "password": hashedPassword};

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

// GET /bookmarks route - user authentication check
router.get("/bookmarks", function (req, res) {
  if (!req.session.user) {
    return res.redirect("/login"); // Redirect to login if not authenticated
  }
  res.sendFile(path.join(__dirname, "../public/bookmarks.html"));
});

// Get bookmark data to populate table
router.get("/bookmarks/data", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const username = req.session.user.username;
  try {
    const db = getDB();
    const bookmarks = await db.collection("bookmarks").find({ username }).toArray();
    res.json({ username, bookmarks });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/bookmarks/add", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { title, url } = req.body;
  const username = req.session.user.username;

  try {
    const db = getDB();
    const result = await db.collection("bookmarks").insertOne({ username, title, url });
    res.status(201).json({ message: "Bookmark added", id: result.insertedId });
  } catch (error) {
    console.error("Error adding bookmark:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/delete", async (req, res) => {
  const { url } = req.body;
  const username = req.session.user.username; // Assuming the username is stored in session

  if (!username) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  if (!url) {
    return res.status(400).json({ message: "URL is required" });
  }

  try {
    const db = getDB();
    const result = await db.collection("bookmarks").deleteOne({ url, username });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Bookmark not found or user not authorized to delete this bookmark" });
    }

    res.json({ message: "Bookmark deleted successfully" });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    res.status(500).json({ message: "Failed to delete bookmark" });
  }
});



module.exports = router;
