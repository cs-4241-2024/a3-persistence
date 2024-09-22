// public/js/main.js
// Function to add a task with confirmation
document.getElementById('addTaskForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Confirmation popup for adding a task
  if (!confirm('Are you sure you want to add this task?')) {
    return; // Exit if the user cancels
  }

  const taskName = document.getElementById('taskName').value;
  const dueDate = document.getElementById('dueDate').value;
  const priority = document.getElementById('priority').value;

  const response = await fetch('/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskName, dueDate, priority })
  });

  const data = await response.json();
  displayTasks(data);
});

// Function to modify a task with confirmation
document.getElementById('modifyTaskForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Confirmation popup for modifying a task
  if (!confirm('Are you sure you want to modify this task?')) {
    return; // Exit if the user cancels
  }

  const oldTaskName = document.getElementById('oldTaskName').value;
  const newTaskName = document.getElementById('newTaskName').value;
  const dueDate = document.getElementById('newDueDate').value;
  const priority = document.getElementById('newPriority').value;

  const response = await fetch('/modify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ oldTaskName, newTaskName, dueDate, priority })
  });

  const data = await response.json();
  displayTasks(data);
});

// Function to delete a task with confirmation
async function deleteTask(taskName) {
  // Confirmation popup for deleting a task
  if (!confirm(`Are you sure you want to delete the task "${taskName}"?`)) {
    return; // Exit if the user cancels
  }

  const response = await fetch('/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskName })
  });

  const data = await response.json();
  displayTasks(data);
}

// Function to display tasks
function displayTasks(tasks) {
  const taskTableBody = document.getElementById('taskTableBody');
  taskTableBody.innerHTML = tasks.map(task => `
        <tr>
            <td>${task.taskName}</td>
            <td>${task.dueDate}</td>
            <td>${task.priority}</td>
            <td>${task.daysRemaining}</td>
            <td><button onclick="deleteTask('${task.taskName}')">Delete</button></td>
        </tr>
    `).join('');
}

// Fetch and display tasks on initial load
async function fetchTasks() {
  const response = await fetch('/results');
  const data = await response.json();
  displayTasks(data);
}

// Fetch tasks when the page loads
fetchTasks();
