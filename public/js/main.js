
if (typeof window !== 'undefined') {
  window.onload = () => {
    document.querySelector("#registerForm").onsubmit = register;
    document.querySelector("#loginForm").onsubmit = login;
    document.querySelector("#logoutButton").onclick = logout;
    document.querySelector("#dataForm").onsubmit = submit;
  };


  async function register(event) {
    event.preventDefault();
    const username = document.querySelector('#registerUsername').value;
    const password = document.querySelector('#registerPassword').value;

    console.log('Register function called');
    console.log('Username:', username);
    console.log('Password:', password);

    const response = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    console.log('Response status:', response.status);

    if (response.ok) {
      alert('Registration successful');
    } else {
      const errorText = await response.text();
      alert(`Registration failed: ${errorText}`);
    }
  }

  const login = async (event) => {
    event.preventDefault();
    const username = document.querySelector('#loginUsername').value;
    const password = document.querySelector('#loginPassword').value;

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username, password })
      });

      if (response.ok) {

        document.getElementById('authContainer').style.display = 'none';
        document.getElementById('todoContainer').style.display = 'block';

        loadTasks();
      } else {
        const errorText = await response.text();
        alert('Login failed: ' + errorText);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed due to a network error');
    }
  };

  async function logout() {
    try {
      await fetch('/logout');
      document.getElementById('authContainer').style.display = 'block';
      document.getElementById('todoContainer').style.display = 'none';
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Logout failed due to a network error');
    }
  }


  async function submit(event) {
    event.preventDefault();

    const inputTask = document.querySelector('#task');
    const inputDescription = document.querySelector('#description');
    const inputPriority = document.querySelector('#priority');

    const newItem = {
      task: inputTask.value,
      description: inputDescription.value,
      priority: inputPriority.value,
      created_at: new Date().toISOString()
    };

    const response = await fetch('/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
    });

    const data = await response.json();
    updateTable(data);
  }


  const deleteItem = async (id) => {
    const response = await fetch(`/data/${id}`, {
      method: 'DELETE'
    });

    const data = await response.json();
    updateTable(data);
  };


  const updateTable = (data) => {
    const resultsTable = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
    resultsTable.innerHTML = '';

    data.forEach(item => {
      const row = resultsTable.insertRow();
      const taskCell = row.insertCell(0);
      const descriptionCell = row.insertCell(1);
      const priorityCell = row.insertCell(2);
      const createdAtCell = row.insertCell(3);
      const dueDateCell = row.insertCell(4);
      const actionCell = row.insertCell(5);

      taskCell.textContent = item.task;
      priorityCell.textContent = item.priority;
      descriptionCell.textContent = item.description;
      createdAtCell.textContent = new Date(item.created_at).toLocaleDateString();
      dueDateCell.textContent = item.due_date || 'No Due Date';

      taskCell.onclick = () => makeEditable(taskCell, 'task', item._id);
      descriptionCell.onclick = () => makeEditable(descriptionCell, 'description', item._id);
      priorityCell.onclick = () => makePriorityEditable(priorityCell, item._id);

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = () => deleteItem(item._id);
      actionCell.appendChild(deleteButton);
    });
  };


  const makeEditable = (cell, field, id) => {
    const originalText = cell.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = originalText;
    cell.innerHTML = '';
    cell.appendChild(input);
    input.focus();

    input.style.width = '100%';
    input.style.boxSizing = 'border-box';

    input.onblur = async () => {
      const newValue = input.value;
      cell.innerHTML = newValue;

      const updatedItem = { _id: id, [field]: newValue, created_at: new Date().toISOString() };
      await fetch('/data', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      });

      const response = await fetch('/data');
      const data = await response.json();
      updateTable(data);
    };

    input.onkeypress = (event) => {
      if (event.key === 'Enter') {
        input.blur();
      }
    };
  };


  const makePriorityEditable = (cell, id) => {
    const originalText = cell.textContent;
    const select = document.createElement('select');

    ['Low', 'Medium', 'High'].forEach(priority => {
      const option = document.createElement('option');
      option.value = priority;
      option.textContent = priority;
      if (priority === originalText) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    cell.innerHTML = '';
    cell.appendChild(select);
    select.focus();

    select.style.width = '100%';
    select.style.boxSizing = 'border-box';

    select.onblur = select.onchange = async () => {
      const newValue = select.value;
      cell.innerHTML = newValue;

      const updatedItem = { _id: id, priority: newValue, created_at: new Date().toISOString() };
      await fetch('/data', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      });

      const response = await fetch('/data');
      const data = await response.json();
      updateTable(data);
    };
  };


  const loadTasks = async () => {
    const response = await fetch('/data');
    const data = await response.json();
    updateTable(data);
  };
}