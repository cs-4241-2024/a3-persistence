document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");
  const todoForm = document.getElementById("todo-form");
  const taskList = document.getElementById("task-list");
  const clearListBtn = document.getElementById("clear-list");
  const logoutBtn = document.getElementById("logout");
  const todoSection = document.getElementById("todo-section");
  const registerSection = document.getElementById("register-section");
  const loginSection = document.getElementById("login-section");

  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;

    const response = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      alert("Registration successful. You can now log in.");
      registerForm.reset();
    } else {
      alert("Error registering user.");
    }
  });

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      alert("Login successful.");
      loginForm.reset();
      showTodoSection();
      loadTasks();
    } else {
      alert("Invalid username or password.");
    }
  });

  logoutBtn.addEventListener("click", async function () {
    const response = await fetch("/logout", { method: "POST" });
    if (response.ok) {
      alert("Logged out successfully.");
      hideTodoSection();
    }
  });

  todoForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const taskText = document.getElementById("task-input").value.trim();
    const priority = document.getElementById("priority-input").value;

    if (taskText !== "") {
      const response = await fetch("/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: taskText, priority }),
      });

      if (response.ok) {
        const task = await response.json();
        addTaskToDOM(task);
        todoForm.reset();
      } else {
        alert("Error adding task.");
      }
    }
  });

  clearListBtn.addEventListener("click", async function () {
    const response = await fetch("/clear", { method: "POST" });
    if (response.ok) {
      taskList.innerHTML = "";
    }
  });

  function showTodoSection() {
    registerSection.style.display = "none";
    loginSection.style.display = "none";
    todoSection.style.display = "block";
  }

  function hideTodoSection() {
    registerSection.style.display = "block";
    loginSection.style.display = "block";
    todoSection.style.display = "none";
    taskList.innerHTML = "";
  }

  async function loadTasks() {
    const response = await fetch("/tasks");
    if (response.ok) {
      const tasks = await response.json();
      tasks.forEach(addTaskToDOM);
    }
  }

  function addTaskToDOM(task) {
    const taskCard = document.createElement("div");
    taskCard.classList.add("task-card");

    const taskTitle = document.createElement("h3");
    taskTitle.textContent = task.task;
    taskCard.appendChild(taskTitle);

    const priorityBadge = document.createElement("span");
    priorityBadge.textContent =
      task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
    priorityBadge.classList.add("priority", task.priority);
    taskCard.appendChild(priorityBadge);

    const datesSection = document.createElement("div");
    datesSection.innerHTML = `<strong>Created At:</strong> ${new Date(
      task.created_at
    ).toLocaleString()}`;
    taskCard.appendChild(datesSection);

    taskList.appendChild(taskCard);
  }
});
