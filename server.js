const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const morgan = require("morgan");
const serveStatic = require("serve-static");
require("dotenv").config();

const app = express();
const dir = "public/";
const port = 3000;
const PASSWORD = process.env.MONGODB_PASSWORD;
const USERNAME = process.env.MONGODB_USERNAME;
const URI = process.env.MONGODB_URI;

mongoose.connect(`mongodb+srv://${USERNAME}:${PASSWORD}@${URI}`)
  .then(() => console.log(Date().valueOf(), ": Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Define the schema for the database
const studentSchema = new mongoose.Schema({
  name: String,
  classYear: String,
  grade: Number,
  gradeLetter: String,
});
const userSchema = new mongoose.Schema({
  username: String,
  password: String, // yes, I know it's not good to store passwords in plaintext but I don't want to deal with hashing right now
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
});

// Create the models
const User = mongoose.model("User", userSchema);
const Student = mongoose.model("Student", studentSchema);

// Middleware
app.use(express.json());
app.use(serveStatic(path.join(__dirname, dir), { index: "index.html" }));
app.use(morgan("dev"));

// GET request handlers
app.get("/", (req, res) => {
  // console.log(Date().valueOf(), ": GET: /");
  res.sendFile(path.join(__dirname, dir, "index.html"));
});

app.get("/students", async (req, res) => {
  // console.log(Date().valueOf(), ": GET: /students");
  const students = await Student.find();
  console.log(students);
  res
    .status(200)
    .json({ students: students, stats: await calculateClassGradeStatsDB() });
});

app.get("/students/:id", async (req, res) => {
  // console.log(Date().valueOf(), ": GET: /students/:id");
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).populate("students");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      students: user.students,
      stats: await calculateClassGradeStatsDB(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST request handlers
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username: username, password: password });
    if (user) {
      res
        .status(200)
        .json({ success: true, message: "Login successful.", userId: user.id });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Login failed. Please try again." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post("/create-account", async (req, res) => {
  // console.log(Date().valueOf(), ": POST: /create-account");

  // handle the request
  try {
    const { username, password } = req.body;

    const existing = await User.findOne({ username: username });
    if (existing) {
      res.status(400).json({ message: "Username already exists" });
    } else {
      const newUser = new User({ username: username, password: password });
      await newUser.save();
      res.status(201).json({ message: "Account created. Please login." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/add", async (req, res) => {
  // console.log(Date().valueOf(), ": POST: /add");

  // handle the request
  let student = req.body.student;
  let code = await addStudentDB(student, req.body.id);

  if (code == 0) {
    // Student already exists
    res.status(204).json({});
  } else if (code == 1) {
    // Student successfully added
    res.status(201).json({
      value: student.gradeLetter,
      stats: await calculateClassGradeStatsDB(),
    });
  } else if (code == 2) {
    // Student updated with different grade or class
    res.status(200).json({
      value: student.gradeLetter,
      stats: await calculateClassGradeStatsDB(),
    });
  }
});

app.post("/delete", async (req, res) => {
  // console.log(Date().valueOf(), ": POST: /delete");

  // handle the request
  let student = req.body.name;
  let success = await deleteStudentDB(student, req.body.id);

  // deleteStudentDB returns 0 on failure, 1 on success
  if (success) {
    res.status(200).json({
      message: "Student deleted",
      stats: await calculateClassGradeStatsDB(),
    });
  } else {
    res.status(400).send("400: Bad Request - Student not found");
  }
});

/**
 * Adds a student to the database or updates their existing record if the student already exists.
 * @param {json} student the student to be added or updated
 * @returns A success code indicating the outcome of the operation:
 * - 0: Bad Request - Student already exists.
 * - 1: Student successfully added.
 * - 2: Student updated with different grade or class.
 */
async function addStudentDB(student, userId) {
  let gradeLetter = student.grade;
  switch (true) {
    case gradeLetter >= 90:
      gradeLetter = "A";
      break;
    case gradeLetter >= 80:
      gradeLetter = "B";
      break;
    case gradeLetter >= 70:
      gradeLetter = "C";
      break;
    default:
      gradeLetter = "NR";
  }
  student.gradeLetter = gradeLetter;

  const user = await User.findById(userId);
  let existingStudent;
  if (user) {
    existingStudent = await Student.findOne({
      name: student.name,
      _id: { $in: user.students },
    });
  }

  if (!user) {
    // console.log(Date().valueOf(), ": ERR POST: User not found.");
    return 4; // User not found
  }

  if (existingStudent) {
    if (
      existingStudent.grade === student.grade &&
      existingStudent.classYear === student.classYear
    ) {
      // console.log(Date().valueOf(), ": ERR POST: Student already exists");
      return 0; // Identical student already exists
    } else {
      existingStudent.grade = student.grade;
      existingStudent.classYear = student.classYear;
      existingStudent.gradeLetter = gradeLetter;
      console.log(
        Date().valueOf(),
        ": ADD: Student",
        existingStudent.id,
        "updated."
      );
      await existingStudent.save();
      return 2; // Student updated with different grade or class
    }
  } else {
    const newStudent = new Student(student);
    await newStudent.save();
    user.students.push(newStudent._id);
    await user.save();
    console.log(Date().valueOf(), ": ADD: Student", newStudent.id, "created.");
    return 1;
  }
}

/**
 * Deletes a student from the database.
 * @param {json} student
 * @returns
 */
async function deleteStudentDB(studentName, userId) {
  const user = await User.findOne({ _id: userId });
  // console.log(user, userId);
  if (!user) {
    console.log(Date().valueOf(), ": ERR DELETE: User not found.");
    return 0;
  }

  const result = await Student.deleteOne({
    name: studentName,
    _id: { $in: user.students },
  });

  if (result === 0)
    console.log(Date().valueOf(), ": ERR DELETE: Student not found.");
  else
    console.log(Date().valueOf(), ": DELETE: Student", studentName, "deleted.");

  return result.deletedCount ? 1 : 0;
}

/**
 * Calculates the class grade statistics from the database.
 * @returns classStats object containing the number of students in each class, the average grade for each class, and the average grade for the entire class.
 */
async function calculateClassGradeStatsDB() {
  const students = await Student.find();

  let counts = {
    senior: 0,
    junior: 0,
    sophomore: 0,
    freshman: 0,
    grad: 0,
    parttime: 0,
  };

  let avgs = {
    senior: 0,
    junior: 0,
    sophomore: 0,
    freshman: 0,
    grad: 0,
    parttime: 0,
  };

  let classAvg = 0;
  students.forEach((student) => {
    classAvg += student.grade;
    switch (student.classYear) {
      case "senior":
        counts.senior++;
        avgs.senior += student.grade;
        break;
      case "junior":
        counts.junior++;
        avgs.junior += student.grade;
        break;
      case "sophomore":
        counts.sophomore++;
        avgs.sophomore += student.grade;
        break;
      case "freshman":
        counts.freshman++;
        avgs.freshman += student.grade;
        break;
      case "grad":
        counts.grad++;
        avgs.grad += student.grade;
        break;
      case "part-time":
        counts.parttime++;
        avgs.parttime += student.grade;
        break;
    }
  });

  classAvg =
    students.length == 0
      ? 0
      : parseFloat((classAvg / students.length).toFixed(2));
  avgs.senior =
    counts.senior == 0
      ? 0
      : parseFloat((avgs.senior / counts.senior).toFixed(2));
  avgs.junior =
    counts.junior == 0
      ? 0
      : parseFloat((avgs.junior / counts.junior).toFixed(2));
  avgs.sophomore =
    counts.sophomore == 0
      ? 0
      : parseFloat((avgs.sophomore / counts.sophomore).toFixed(2));
  avgs.freshman =
    counts.freshman == 0
      ? 0
      : parseFloat((avgs.freshman / counts.freshman).toFixed(2));
  avgs.grad =
    counts.grad == 0 ? 0 : parseFloat((avgs.grad / counts.grad).toFixed(2));
  avgs.parttime =
    counts.parttime == 0
      ? 0
      : parseFloat((avgs.parttime / counts.parttime).toFixed(2));

  let classStats = {
    counts: counts,
    avgs: avgs,
    classAvg: classAvg,
  };

  return classStats;
}

// Start the server
app.listen(process.env.PORT || port, () => {
  console.log(`Server running on port ${port}`);
});
