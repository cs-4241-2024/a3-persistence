/**
 * Updates a student's entry in the table.
 *
 * @param {Object} student - The student object to be updated.
 * @returns {void}
 */
function updateStudentEntry(student) {
  let table = document.getElementById("table-body");
  let rows = table.getElementsByTagName("tr");
  for (let i = 0; i < rows.length; i++) {
    let name = rows[i].getElementsByTagName("td")[0].innerHTML;
    if (name === student.name) {
      rows[i].getElementsByTagName("td")[1].innerHTML = student.classYear;
      rows[i].getElementsByTagName("td")[2].innerHTML = student.grade;
      rows[i].getElementsByTagName("td")[3].innerHTML = student.gradeLetter;
      return;
    }
  }

  console.error("Student not found");
}

/**
 * Deletes a student from the table.
 *
 * @param {string} studentName - The name of the student to delete.
 * @returns {void}
 */
function removeFromTable(studentName) {
  let table = document.getElementById("table-body");
  let rows = table.getElementsByTagName("tr");
  for (let i = 0; i < rows.length; i++) {
    let name = rows[i].getElementsByTagName("td")[0].innerHTML;
    if (name === studentName) {
      table.deleteRow(i);
      return;
    }
  }

  console.error("Student not found");
}

/**
 * Adds a student to the table.
 *
 * @param {Object} student - The student object to be added.
 * @returns {void}
 */
export function addStudentToTable(student, userId) {
  let tbody = document.getElementById("table-body");
  let row = document.createElement("tr");
  let nameEl = document.createElement("td");
  let classYearEl = document.createElement("td");
  let gradeEl = document.createElement("td");
  let gradeLetterEl = document.createElement("td");
  let actionEl = document.createElement("td");
  let deleteButton = document.createElement("button");

  nameEl.innerText = student.name;
  classYearEl.innerText = student.classYear;
  gradeEl.innerText = student.grade;
  gradeLetterEl.innerText = student.gradeLetter;

  deleteButton.innerText = "Delete";
  deleteButton.className = "delete-button";
  deleteButton.onclick = async function () {
    const name = student.name,
      json = { name: name },
      body = JSON.stringify(json);

    const response = await fetch("/delete", {
      method: "POST",
      body,
      headers: { 
        "Content-Type": "application/json",
        "userId": userId,
       },  // this is important to send JSON data to the server, I spent an hour debugging this before remembering this was mentioned in class.
    });
    const res = await response.json();

    if (response.status === 400) {
      alert("Student not found");
      return;
    } else if (response.status == 200) {
      removeFromTable(name);
      updateClassStats(res.stats);
    }
  };
  actionEl.appendChild(deleteButton);

  row.appendChild(nameEl);
  row.appendChild(classYearEl);
  row.appendChild(gradeEl);
  row.appendChild(gradeLetterEl);
  row.appendChild(actionEl);

  tbody.appendChild(row);
}

/**
 * Takes in class statistics object returned from server, and populates stats table on page.
 * @param {*} stats the class statistics object
 */
export function updateClassStats(stats) {
  let allAvg = document.getElementById("all-avg"),
    allCount = document.getElementById("all-count"),
    freshmanAvg = document.getElementById("freshman-avg"),
    freshmanCount = document.getElementById("freshman-count"),
    sophomoreAvg = document.getElementById("sophomore-avg"),
    sophomoreCount = document.getElementById("sophomore-count"),
    juniorAvg = document.getElementById("junior-avg"),
    juniorCount = document.getElementById("junior-count"),
    seniorAvg = document.getElementById("senior-avg"),
    seniorCount = document.getElementById("senior-count"),
    gradAvg = document.getElementById("grad-avg"),
    gradCount = document.getElementById("grad-count"),
    partTimeAvg = document.getElementById("part-time-avg"),
    partTimeCount = document.getElementById("part-time-count");

  allAvg.innerHTML = stats.classAvg;
  let total = 0;
  for (let key in stats.counts) {
    total += stats.counts[key];
  }
  allCount.innerHTML = total;
  freshmanAvg.innerHTML = stats.avgs.freshman;
  freshmanCount.innerHTML = stats.counts.freshman;
  sophomoreAvg.innerHTML = stats.avgs.sophomore;
  sophomoreCount.innerHTML = stats.counts.sophomore;
  juniorAvg.innerHTML = stats.avgs.junior;
  juniorCount.innerHTML = stats.counts.junior;
  seniorAvg.innerHTML = stats.avgs.senior;
  seniorCount.innerHTML = stats.counts.senior;
  gradAvg.innerHTML = stats.avgs.grad;
  gradCount.innerHTML = stats.counts.grad;
  partTimeAvg.innerHTML = stats.avgs.parttime;
  partTimeCount.innerHTML = stats.counts.parttime;
}

/**
 * Handles the form submission for adding a student.
 *
 * @param {Event} e - The form submission event.
 * @returns {void}
 */
export async function handleAdd(e, userId) {
  e.preventDefault();

  // get all the input fields
  const name = document.querySelector("#name"),
    classYear = document.querySelector("#class"),
    grade = document.querySelector("#grade"),
    json = { student: {name: name.value, classYear: classYear.value, grade: grade.value}, id: userId },
    body = JSON.stringify(json);

  // form validation
  if (name.value === "" || classYear.value === "" || grade.value === "") {
    alert("Please ensure all fields are filled out correctly.");
    return;
  }
  if (grade.value < 0 || grade.value > 100) {
    alert("Please enter a valid grade.");
    return;
  }

  // add the student to the table with their calculated grade letter
  const response = await fetch("/add", {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" },
  });

  let res = await response.json().catch((err) => {
    // console.log("Student already exists");
  });
  if (response.status === 204) {
    // alert("Student already exists");
    console.error("Identical student already exists");
    return;
  }

  let student = {
    name: name.value,
    classYear: classYear.value,
    grade: grade.value,
    gradeLetter: res.value,
  };
  if (response.status === 201) {
    addStudentToTable(student, userId);
  } else if (response.status === 200) {
    updateStudentEntry(student);
  }
  updateClassStats(res.stats);
};
