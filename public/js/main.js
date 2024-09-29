const submit = async function(event) {
  event.preventDefault();

  const taskInput = document.querySelector('#task').value;
  const priorityInput = document.querySelector('#priority').value;

  const taskData = {
    task: taskInput,
    priority: priorityInput
  };

  const response = await fetch('/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  });

  if (response.ok) {
    loadTasks();
    document.querySelector('#task').value = '';
  } else {
    alert('Failed to add task');
  }
};

const loadTasks = async function() {
  const response = await fetch('/tasks');
  if (!response.ok) {
    alert('Error loading tasks');
    return;
  }

  const tasks = await response.json();
  const tableBody = document.querySelector('#taskTable tbody');
  tableBody.innerHTML = '';

  tasks.forEach(task => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${task.task}</td>
      <td>${task.priority}</td>
      <td>${new Date(task.creationDate).toLocaleString()}</td>
      <td><button onclick="deleteTask('${task._id}')">Delete</button></td>
    `;
    tableBody.appendChild(row);
  });
};

const deleteTask = async function(id) {
  const response = await fetch(`/tasks/${id}`, { method: 'DELETE' });

  if (response.ok) {
    loadTasks();
  } else {
    alert('Failed to delete task');
  }
};

window.onload = function() {
  document.querySelector('#taskForm').onsubmit = submit;
  loadTasks();
};
