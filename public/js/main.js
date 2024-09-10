window.onload = async function () {
  const handleAdd = await import("./student.js").then((module) => module.handleAdd);
  const addStudentToTable = await import("./student.js").then((module) => module.addStudentToTable);
  const updateClassStats = await import("./student.js").then((module) => module.updateClassStats);

  const submitButton = document.getElementById("submit");
  submitButton.onclick = handleAdd;

  // populate the table with the existing students (if any)
  const response = await fetch("/students", { method: "GET" });
  const res = await response.json();
  if (res.students) {
    res.students.forEach((student) => addStudentToTable(student));
  }
  updateClassStats(res.stats);

  // Display body when DOM is loaded
  document.body.style.visibility = 'visible';
};
