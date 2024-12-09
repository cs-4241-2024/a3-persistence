const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const app = express();
const port = 3000;

// MongoDB Connection
mongoose.connect('mongodb://localhost/studentdb')
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema and Model
const userSchema = new mongoose.Schema({
  username: String,
  userId: mongoose.Schema.Types.ObjectId
});

const User = mongoose.model('User', userSchema);

// Student Schema and Model
const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  year: Number,
  grade: Number,
  status: String,
  userId: mongoose.Schema.Types.ObjectId
});

const Student = mongoose.model('Student', studentSchema);

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));

// Helper function
function calculateStatus(grade) {
  return grade >= 60 ? 'Passed' : 'Failed';
}

// Login Route
app.post('/login', async (req, res) => {
  const { username } = req.body;

  if (!username || username.trim() === "") {
    return res.status(400).send('Login failed: No username provided');
  }

  try {
    let user = await User.findOne({ username });

    if (user) {
      req.session.userId = user.userId;
      console.log(`User ${username} logged in with existing userId:`, req.session.userId);
    } else {
      const newUserId = new mongoose.Types.ObjectId();
      user = new User({ username, userId: newUserId });
      await user.save();
      req.session.userId = newUserId;
      console.log(`New user ${username} created with userId:`, req.session.userId);
    }

    res.status(200).send({ message: 'Login successful' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send({ error: 'Login error: ' + err.message });
  }
});

// Student Add/Update/Delete Route
app.post('/student', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send('Unauthorized: No active session');
  }

  const { name, age, year, grade, action } = req.body;

  if (action !== 'delete' && (!name || !age || !year || !grade)) {
    return res.status(400).send('Bad request: Missing student data');
  }

  try {
    if (action === 'add') {
      console.log(`Checking if student ${name} already exists for user ${req.session.userId}`);

      const existingStudent = await Student.findOne({ name, userId: req.session.userId });

      if (existingStudent) {
        console.log(`Updating existing student ${name}`);
        existingStudent.age = age;
        existingStudent.year = year;
        existingStudent.grade = grade;
        existingStudent.status = calculateStatus(grade);

        const updatedStudent = await existingStudent.save();
        res.status(200).send({ message: 'Student updated successfully', student: updatedStudent });
      } else {
        console.log(`Adding new student ${name}`);
        const newStudent = new Student({
          name,
          age,
          year,
          grade,
          status: calculateStatus(grade),
          userId: req.session.userId
        });
        const student = await newStudent.save();
        res.status(200).send({ message: 'Student added successfully', student });
      }
    } else if (action === 'delete') {
      console.log(`Deleting student: ${name}`);
      
      const deleteResult = await Student.deleteOne({ name, userId: req.session.userId });
      
      if (deleteResult.deletedCount === 0) {
        // No documents matched the query
        return res.status(404).send({ message: 'Student not found or already deleted' });
      }
      
      res.status(200).send({ message: 'Student deleted successfully' });
    } else {
      res.status(400).send('Invalid action');
    }
  } catch (err) {
    console.error('Error processing student request:', err);
    res.status(500).send({ error: 'Error processing student request: ' + err.message });
  }
});

// Data Fetch Route
app.get('/data', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const students = await Student.find({ userId: req.session.userId });
    res.json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).send({ error: 'Error fetching students: ' + err.message });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});





