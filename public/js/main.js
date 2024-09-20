const logOut = async function () {
  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
    logoutButton.onclick = async function () {
      const response = await fetch('/logout', {
        method: 'GET'
      });
      if (response.ok) {
        //Redirect to login page if logout is succesful
        window.location.href = '/login.html'; 
      }
    };
  }
};

const updateTable = async function () {
  const response = await fetch('/submit', {
    method: 'POST',
    body: JSON.stringify({action: 'get'}),
    headers: {'Content-Type': 'application/json'}
  })


  if (response.status === 401) {
    window.location.href = '/login.html';
  } 
  else {
    const data = await response.json()

    const tableBody = document.querySelector('#tasksTable tbody')
    tableBody.innerHTML = '' //Clear the table

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
  }
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
    headers: {'Content-Type': 'application/json'}
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
    headers: {'Content-Type': 'application/json'}
  });

  await updateTable();
};

window.onload = function () {
  updateTable();
  logOut();

  const addTaskForm = document.querySelector('#addTaskForm');
  addTaskForm.onsubmit = addTask;

  const deleteTaskForm = document.querySelector('#deleteTaskForm');
  deleteTaskForm.onsubmit = deleteTask;
};