const login = async function(event) {
  event.preventDefault();

  const usernameInput = document.querySelector('#username'),
        passwordInput = document.querySelector('#password');

  const user = {
    username: usernameInput.value,
    password: passwordInput.value
  };

  const response = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });

  if (response.ok) {
    document.querySelector('#loginForm').reset();  
    await loadTasks(); 
    document.querySelector('#loginSection').style.display = 'none';
    document.querySelector('#taskSection').style.display = 'block';
  } else {
    console.error('Failed to login');
    alert('Login failed. Check password and user');
  }
};

const logout = async function() {
  const response = await fetch('/logout');
  if (response.ok) {
    document.querySelector('#taskSection').style.display = 'none';
    document.querySelector('#loginSection').style.display = 'block';
  } else {
    console.error('Failed to logout');
  }
};

const loadTasks = async function() {
  try {
    const response = await fetch('/tasks');
    if (response.ok) {
      const tasks = await response.json();

      const taskTableBody = document.querySelector('#taskTable tbody');
      taskTableBody.innerHTML = '';

      tasks.forEach(task => {
        const row = document.createElement('tr');

        row.innerHTML = `
          <td><input type="text" value="${task.description}" disabled></td>
          <td>
            <select disabled>
              <option value="High" ${task.priority === 'High' ? 'selected' : ''}>High</option>
              <option value="Medium" ${task.priority === 'Medium' ? 'selected' : ''}>Medium</option>
              <option value="Low" ${task.priority === 'Low' ? 'selected' : ''}>Low</option>
            </select>
          </td>
          <td><input type="date" value="${task.dueDate.substring(0, 10)}" disabled></td>
          <td>${task.urgency !== undefined ? task.urgency : 'N/A'}</td>
          <td>
            <button onclick="deleteTask('${task._id}')">Delete</button>
            <button class="edit-btn">Edit</button>
            <button class="save-btn" style="display: none;">Save</button>
          </td>
        `;

        row.querySelector(".edit-btn").addEventListener("click", function() {
          row.querySelectorAll("input, select").forEach(input => input.disabled = false);
          row.querySelector(".edit-btn").style.display = "none";
          row.querySelector(".save-btn").style.display = "inline";
        });

        row.querySelector(".save-btn").addEventListener("click", function() {
          const updatedTask = {
            _id: task._id,
            description: row.querySelector("input[type='text']").value,
            priority: row.querySelector("select").value,
            dueDate: row.querySelector("input[type='date']").value
          };

          updateTask(updatedTask);

          row.querySelectorAll("input, select").forEach(input => input.disabled = true);
          row.querySelector(".save-btn").style.display = "none";
          row.querySelector(".edit-btn").style.display = "inline";
        });

        taskTableBody.appendChild(row);
      });
    } else if (response.status === 401) {
      console.error('Not authorized');
      document.querySelector('#taskSection').style.display = 'none';
      document.querySelector('#loginSection').style.display = 'block';
      alert('Please log in to access tasks.');
    } else {
      console.error('Failed to fetch tasks');
    }
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
};

const checkSession = async function() {
  try {
    const response = await fetch('/check-session'); 
    if (response.ok) {
      const data = await response.json();
      if (data.loggedIn) {
        await loadTasks();
        document.querySelector('#loginSection').style.display = 'none';
        document.querySelector('#taskSection').style.display = 'block';
      } else {
        document.querySelector('#loginSection').style.display = 'block';
        document.querySelector('#taskSection').style.display = 'none';
      }
    } else {
      console.error('Failed session check');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

const submit = async function(event) {
  event.preventDefault();

  const descriptionInput = document.querySelector('#description'),
        priorityInput = document.querySelector('#priority'),
        dueDateInput = document.querySelector('#dueDate');

  const task = {
    description: descriptionInput.value,
    priority: priorityInput.value,
    dueDate: dueDateInput.value
  };

  const response = await fetch('/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });

  if (response.ok) {
    await loadTasks();
    document.querySelector('#taskForm').reset();
  } else {
    console.error('Failed to add task');
  }
};

const updateTask = async function(task) {
  try {
    const response = await fetch(`/tasks/${task._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    });

    if (response.ok) {
      await loadTasks();
    } else {
      console.error('Failed to update task');
    }
  } catch (error) {
    console.error('Error updating task:', error);
  }
};

const deleteTask = async function(taskId) {
  try {
    const response = await fetch(`/tasks/${taskId}`, { method: 'DELETE' });

    if (response.ok) {
      await loadTasks();
    } else {
      console.error('delete task failed');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

window.onload = async function() {
  await checkSession();

  const loginForm = document.querySelector('#loginForm');
  loginForm.onsubmit = login;
  const logoutBtn = document.querySelector('#logoutBtn');
  logoutBtn.onclick = logout;
  const taskForm = document.querySelector('#taskForm');
  taskForm.onsubmit = submit;
};
