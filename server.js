require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();


app.use(express.json());


mongoose
  .connect(process.env.MONGO_URL, {
    serverSelectionTimeoutMS: 20000, 
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); 
  });


app.get("/", (req, res) => {
  console.log("Root route accessed. Serving login page.");
  res.sendFile(path.join(__dirname, "public", "login.html")); // Serve login page
});


app.use(express.static(path.join(__dirname, "public")));


app.get("/dashboard", (req, res) => {
  console.log("Dashboard route accessed. Serving index.html (dashboard).");
  res.sendFile(path.join(__dirname, "public", "index.html")); // Serve task manager page
});


const taskSchema = new mongoose.Schema({
  name: String,
  dueDate: Date,
  user: String,
});
const Task = mongoose.model("Task", taskSchema);


const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model("User", userSchema);


app.post("/addTask", (req, res) => {
  const newTask = new Task({
    name: req.body.name,
    dueDate: req.body.dueDate,
    user: req.body.user,
  });
  newTask
    .save()
    .then(() => res.send("Task added!"))
    .catch((err) => res.status(400).send("Error: " + err));
});

app.get("/tasks/:user", (req, res) => {
  Task.find({ user: req.params.user })
    .then((tasks) => res.json(tasks))
    .catch((err) => res.status(400).send("Error: " + err));
});

app.put("/editTask/:id", (req, res) => {
  Task.findByIdAndUpdate(req.params.id, req.body)
    .then(() => res.send("Task updated!"))
    .catch((err) => res.status(400).send("Error: " + err));
});

app.delete("/deleteTask/:id", (req, res) => {
  Task.findByIdAndDelete(req.params.id)
    .then(() => res.send("Task deleted!"))
    .catch((err) => res.status(400).send("Error: " + err));
});


app.post("/register", (req, res) => {
  const newUser = new User(req.body);
  newUser
    .save()
    .then(() => res.send("User registered!"))
    .catch((err) => res.status(400).send("Error: " + err));
});


app.post("/login", (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username, password })
    .then((user) => {
      if (user) {
        res.redirect("/dashboard"); 
      } else {
        res.status(400).send("Login failed. Incorrect username or password.");
      }
    })
    .catch((err) => res.status(400).send("Error: " + err));
});


app.get("*", (req, res) => {
  console.log("Fallback route accessed. Redirecting to login.");
  res.redirect("/");
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});


app.post("/register", (req, res) => {
  const newUser = new User(req.body);
  newUser
    .save()
    .then(() => res.send("User registered!"))
    .catch((err) => res.status(400).send("Error: " + err));
});