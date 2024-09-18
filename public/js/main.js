// FRONT-END (CLIENT) JAVASCRIPT HERE

const updateTable = async function () {
  const response = await fetch('/submit', {
    method: 'POST',
    body: JSON.stringify({ action: 'get' }),
    headers: { 'Content-Type': 'application/json' }
  })

  const data = await response.json()

  const tableBody = document.querySelector('#tasksTable tbody')
  tableBody.innerHTML = '' // Clear the table

  data.forEach(task => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${task.task}</td>
      <td>${task.priority}</td>
      <td>${task.created_at}</td>
      <td>${task.deadline}</td>
    `;
    tableBody.appendChild(newRow);
  });
};

const addTask = async function (event) {
  event.preventDefault();

  const task = document.querySelector('#task').value;
  const priority = document.querySelector('#priority').value;

  const data = {
    action: 'add',
    task,
    priority: parseInt(priority)
  };

  const response = await fetch('/submit', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  });

  await updateTable();
};

const deleteTask = async function (event) {
  event.preventDefault();

  const task = document.querySelector('#deleteTask').value;

  const data = {
    action: 'delete',
    task
  };

  const response = await fetch('/submit', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  });

  await updateTable();
};

window.onload = function () {
  updateTable();

  const addTaskForm = document.querySelector('#addTaskForm');
  addTaskForm.onsubmit = addTask;

  const deleteTaskForm = document.querySelector('#deleteTaskForm');
  deleteTaskForm.onsubmit = deleteTask;
};