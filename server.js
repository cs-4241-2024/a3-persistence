const express = require("express");
const path = require("path");

const app = express();
const dir = "public/";
const port = 3000;
let students = [];

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to serve static files
app.use(express.static(dir));

// GET request handlers
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, dir, "index.html"));
});

app.get("/students", (req, res) => {
  res.status(200).json({ students: students, stats: calculateClassGradeStats() });
});

// POST request handlers
app.post("/add", (req, res) => {
  let student = req.body;
  let code = addStudent(student);
  if (code == 0) {
    console.log("Student already exists");
    res.status(204).json({  });
  } else if (code == 1) {
    console.log("Student added");
    res.status(201).json({ value: student.gradeLetter, stats: calculateClassGradeStats() });
  } else if (code == 2) {
    console.log("Student updated");
    res.status(200).json({ value: student.gradeLetter, stats: calculateClassGradeStats() });
  }
  console.log(students);
});

app.post("/delete", (req, res) => {
  let student = req.body;
  let success = deleteStudent(student);
  if (success) {
    res.status(200).json({ message: "Student deleted", stats: calculateClassGradeStats() });
  } else {
    res.status(400).send("400: Bad Request - Student not found");
  }
});

/**
 * Adds a student to the list.
 *
 * @param {Object} student - The student object to be added.
 * @returns {number} - The result code indicating the outcome of the operation:
 *   - 0: Bad Request - Student already exists.
 *   - 1: Student successfully added.
 *   - 2: Student updated with different grade or class.
 */
function addStudent(student) {
  // calculate the grade letter
  let grade = student.grade;
  switch (true) {
    case grade >= 90:
      grade = "A";
      break;
    case grade >= 80:
      grade = "B";
      break;
    case grade >= 70:
      grade = "C";
      break;
    default:
      grade = "NR";
  }

  // check if the student is already in the list
  for (let i = 0; i < students.length; i++) {
    if (
      students[i].name === student.name &&
      students[i].classYear === student.classYear &&
      students[i].grade === student.grade
    ) {
      return 0;
    }
    // if the student exists but has a different grade or class, update the other fields
    else if (students[i].name === student.name) {
      students[i].grade = student.grade;
      students[i].classYear = student.classYear;
      students[i].gradeLetter = grade;
      student.gradeLetter = grade;
      return 2;
    }
  }

  // otherwise, if the student doesn't exist yet, add the student to the list
  student.gradeLetter = grade;
  students.push(student);
  return 1;
}

/**
 * Deletes a student from the list.
 *
 * @param {Object} student - The student object to be deleted.
 * @returns {number} - The result code indicating the outcome of the operation:
 *  - 0: Bad Request - Student not found.
 *  - 1: Student successfully deleted.
 */
function deleteStudent(student) {
  // check if the student is in the list
  for (let i = 0; i < students.length; i++) {
    if (students[i].name === student.name) {
      students.splice(i, 1);
      return 1;
    }
  }

  // if the student is not in the list, return 0 to indicate that the student was not found
  return 0;
}

/**
 * Calculates the class grade statistics.
 * 
 * @returns {Object} - The class grade statistics object.
 * - counts: The number of students in each class.
 * - avgs: The average grade for each class.
 * - classAvg: The average grade for the entire class.
 * 
 * Note: The classAvg is the average of all the students' grades.
 * */
function calculateClassGradeStats() {
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
  for (let i = 0; i < students.length; i++) {
    classAvg += parseInt(students[i].grade);
    switch (students[i].classYear) {
      case "senior":
        counts.senior++;
        avgs.senior += parseInt(students[i].grade);
        break;
      case "junior":
        counts.junior++;
        avgs.junior += parseInt(students[i].grade);
        break;
      case "sophomore":
        counts.sophomore++;
        avgs.sophomore += parseInt(students[i].grade);
        break;
      case "freshman":
        counts.freshman++;
        avgs.freshman += parseInt(students[i].grade);
        break;
      case "grad":
        counts.grad++;
        avgs.grad += parseInt(students[i].grade)
        break;
      case "part-time":
        counts.parttime++;
        avgs.parttime += parseInt(students[i].grade);
        break;
    }
  }

  classAvg = students.length == 0 ? 0 : parseFloat((classAvg / students.length).toFixed(2));
  avgs.senior = counts.senior == 0 ? 0 : parseFloat((avgs.senior / counts.senior).toFixed(2));
  avgs.junior = counts.junior == 0 ? 0 : parseFloat((avgs.junior / counts.junior).toFixed(2));
  avgs.sophomore = counts.sophomore == 0 ? 0 : parseFloat((avgs.sophomore / counts.sophomore).toFixed(2));
  avgs.freshman = counts.freshman == 0 ? 0 : parseFloat((avgs.freshman / counts.freshman).toFixed(2));
  avgs.grad = counts.grad == 0 ? 0 : parseFloat((avgs.grad / counts.grad).toFixed(2));
  avgs.parttime = counts.parttime == 0 ? 0 : parseFloat((avgs.parttime / counts.parttime).toFixed(2));

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