const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/taskly", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // Password will be hashed
});

// Task schema
const taskSchema = new mongoose.Schema({
  task: String,
  description: String,
  dueDate: String,
  creationDate: String,
  priority: String,
  status: String,
  username: String, // Associated with the user
});

// Models
const User = mongoose.model("User", userSchema);
const Task = mongoose.model("Task", taskSchema);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// Registration route
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    req.session.username = user.username;
    res.json({ message: `Welcome, ${user.username}!` });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
});

// Middleware to ensure user is authenticated
const isLoggedIn = (req, res, next) => {
  if (!req.session.username) {
    return res
      .status(403)
      .json({ message: "You must be logged in to access this." });
  }
  next();
};

// Middleware to protect your routes
app.get("/tasks", isLoggedIn, (req, res) => {
  Task.find({ username: req.session.username })
    .then((tasks) => res.json(tasks))
    .catch((err) => res.status(500).json({ error: "An error occurred", err }));
});

// Route to get tasks for the logged-in user
app.get("/tasks", isLoggedIn, (req, res) => {
  Task.find({ username: req.session.username })
    .then((tasks) => res.json(tasks))
    .catch((err) => res.status(500).json({ error: "An error occurred", err }));
});

// Add a new task
app.post("/submit", isLoggedIn, (req, res) => {
  const { task, description, dueDate, priority } = req.body;
  const creationDate = new Date().toISOString().split("T")[0];

  const newTask = new Task({
    task,
    description,
    dueDate,
    creationDate,
    priority,
    status: "In Progress",
    username: req.session.username,
  });

  newTask
    .save()
    .then(() => res.json({ message: "Task added successfully!" }))
    .catch((err) => res.status(500).json({ error: "An error occurred", err }));
});

// Edit a task
app.put("/edit/:id", isLoggedIn, (req, res) => {
  const { task, description, dueDate, priority } = req.body;

  Task.findOneAndUpdate(
    { _id: req.params.id, username: req.session.username },
    { task, description, dueDate, priority, status: "In Progress" },
    { new: true }
  )
    .then((updatedTask) =>
      res.json({ message: "Task updated successfully!", updatedTask })
    )
    .catch((err) => res.status(500).json({ error: "An error occurred", err }));
});

// Delete a task
app.delete("/delete/:id", isLoggedIn, (req, res) => {
  Task.findOneAndDelete({ _id: req.params.id, username: req.session.username })
    .then(() => res.json({ message: "Task deleted successfully!" }))
    .catch((err) => res.status(500).json({ error: "An error occurred", err }));
});

// Mark task as complete
app.put("/complete/:id", isLoggedIn, (req, res) => {
  Task.findOneAndUpdate(
    { _id: req.params.id, username: req.session.username },
    { status: "Completed" },
    { new: true }
  )
    .then((updatedTask) =>
      res.json({ message: "Task marked as complete!", updatedTask })
    )
    .catch((err) => res.status(500).json({ error: "An error occurred", err }));
});

// Mark completed task as "In Progress"
app.put("/in-progress/:id", isLoggedIn, (req, res) => {
  Task.findOneAndUpdate(
    { _id: req.params.id, username: req.session.username },
    { status: "In Progress" },
    { new: true }
  )
    .then((updatedTask) =>
      res.json({ message: "Task marked as In Progress!", updatedTask })
    )
    .catch((err) => res.status(500).json({ error: "An error occurred", err }));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
