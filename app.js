const express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
const { MongoClient } = require("mongodb");

const app = express();

// middleware

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// Connection URI and client setup
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

const databaseName = "bookmarks_db";
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

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Handle authentication logic (e.g., check against the database)
  if (username === "admin" && password === "admin") {
    console.log("redirecting to bookmarks");
    res.redirect("/bookmarks");
  } else {
    res.status(401).json({ message: "Invalid credentials" });
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
