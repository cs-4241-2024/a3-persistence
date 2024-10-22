const express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

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

module.exports = app;
