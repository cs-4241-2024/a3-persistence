document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.querySelector("#taskForm");
  const taskSection = document.getElementById("taskSection");
  const inProgressTable = document.getElementById("inProgressTable");
  const completedTable = document.getElementById("completedTable");
  const logoutBtn = document.getElementById("logoutBtn");

  const elemsDatepicker = document.querySelectorAll(".datepicker");
  M.Datepicker.init(elemsDatepicker, { format: "yyyy-mm-dd" });

  const elemsSelect = document.querySelectorAll("select");
  M.FormSelect.init(elemsSelect);

  const elemsCollapsible = document.querySelectorAll(".collapsible");
  M.Collapsible.init(elemsCollapsible);

  const darkModeToggle = document.getElementById("darkModeToggle");
  const body = document.body;

  // Check localStorage to set previous mode if previously set
  if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark-mode");
    darkModeToggle.checked = true;
  }

  // Toggle dark mode
  darkModeToggle.addEventListener("change", function () {
    if (darkModeToggle.checked) {
      body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "enabled"); // Save preference
    } else {
      body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "disabled"); // Save preference
    }
  });

  let tasks = [];
  let editingTaskId = null;

  var elems = document.querySelectorAll(".datepicker");
  var instances = M.Datepicker.init(elems, {});

  var selectElems = document.querySelectorAll("select");
  var selectInstances = M.FormSelect.init(selectElems, {});

  var elems = document.querySelectorAll(".collapsible");
  var instances = M.Collapsible.init(elems, {
    accordion: false,
  });

  // Ensure the task section is shown when the home page loads
  taskSection.style.display = "block";

  // Check if logout button exists
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      // Clear any session data or cookies here if necessary
      fetch("/logout") // Call the logout
        .then(() => {
          // Refresh the page after logging out
          window.location.href = "/"; // Redirect to login
        })
        .catch((error) => console.error("Error logging out:", error));
    });
  }

  // Load tasks for the logged-in user
  function loadTasks() {
    fetch("/tasks")
      .then((response) => response.json())
      .then((data) => {
        tasks = data;
        renderTasks();
      })
      .catch((error) => console.error("Error:", error));
  }

  // Load tasks for the logged-in user
  loadTasks();

  // Function to calculate days left until due date
  // function calculateDaysLeft(dueDate) {
  //   const currentDate = new Date(); // Today's date
  //   const due = new Date(dueDate); // DueDate

  //   // Calculate the difference in milliseconds
  //   const differenceInTime = due.getTime() - currentDate.getTime();

  //   // Convert to days
  //   const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

  //   // Return the number of days left, or a past due message
  //   return differenceInDays >= 0
  //     ? differenceInDays > 0
  //       ? "${differenceInDays} day(s) left"
  //       : "Due Today"
  //     : "Past Due";
  // }

  // Render tasks in the tables
  function renderTasks() {
    inProgressTable.innerHTML = "";
    completedTable.innerHTML = "";

    tasks.forEach((task) => {
      const taskItem = document.createElement("li");

      // Calculate the days left for the task
      const daysLeft = calculateDaysLeft(task.dueDate);

      // Determine if the task is marked (due today or past due or 1 day left)
      const isUrgent = daysLeft <= 1;

      taskItem.innerHTML = `
    <div class="collapsible-header task-header">
      <span class="task-title">
        <strong>Title:</strong> ${task.task} 
      </span>
      <span class="task-due"><strong>Due Date:</strong> ${task.dueDate}</span>
      <span class="task-time-left"><strong>Time Left:</strong> ${
        daysLeft >= 0
          ? daysLeft > 0
            ? daysLeft + " day(s) left"
            : "Due Today"
          : "Past Due"
      }
      ${
        isUrgent && task.status == "In Progress"
          ? '<i class="material-icons red-text">❗</i>'
          : ""
      }
      </span>
      <span class="task-priority"><strong>Priority:</strong> ${
        task.priority
      }</span>
    </div>
    <div class="collapsible-body">
      <p><strong>Description:</strong> ${task.description}</p>
      <p><strong>Status:</strong> ${task.status}</p>
      ${
        task.status === "In Progress"
          ? `
        <button class="btn edit-btn" onclick="editTask('${task._id}')">Edit</button>
        <button class="btn complete-btn" onclick="completeTask('${task._id}')">Complete</button>
        <button class="btn delete-btn" onclick="deleteTask('${task._id}')">Delete</button>
      `
          : `
        <button class="btn in-progress-btn" onclick="markInProgress('${task._id}')">Mark as In Progress</button>
        <button class="btn delete-btn" onclick="deleteTask('${task._id}')">Delete</button>
      `
      }
    </div>
  `;

      if (task.status === "In Progress") {
        inProgressTable.appendChild(taskItem);
      } else {
        completedTable.appendChild(taskItem);
      }
    });

    // Reinitialize the collapsible after dynamically adding items
    var elems = document.querySelectorAll(".collapsible");
    M.Collapsible.init(elems);
  }

  // Edit a task
  window.editTask = (taskId) => {
    const taskToEdit = tasks.find((task) => task._id === taskId);

    if (task) {
      document.getElementById("task").value = taskToEdit.task;
      document.getElementById("description").value = taskToEdit.description;
      document.getElementById("date").value = taskToEdit.dueDate;
      document.getElementById("priority").value = taskToEdit.priority;

      editingTaskId = taskId; // Track task being edited
      taskForm.querySelector('button[type="submit"]').textContent =
        "Update Task";

      M.updateTextFields();

      const textarea = document.getElementById("description");
      M.textareaAutoResize(textarea);
    }
  };

  // Handle task form submission
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const task = document.getElementById("task").value;
    const description = document.getElementById("description").value;
    const dueDate = document.getElementById("date").value;
    const priority = document.getElementById("priority").value;

    if (editingTaskId) {
      // Update existing task
      fetch(`/edit/${editingTaskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task, description, dueDate, priority }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          loadTasks();
          editingTaskId = null;
          taskForm.reset();
          taskForm.querySelector('button[type="submit"]').textContent =
            "Submit Task";
        })
        .catch((error) => console.error("Error:", error));
    } else {
      // Add new task
      fetch("/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task, description, dueDate, priority }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          loadTasks();
          taskForm.reset();
        })
        .catch((error) => console.error("Error:", error));
    }
    const textarea = document.getElementById("description");
    textarea.value = "";
    M.textareaAutoResize(textarea);
  });

  // Delete a task
  window.deleteTask = (taskId) => {
    fetch(`/delete/${taskId}`, { method: "DELETE" })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        loadTasks();
      })
      .catch((error) => console.error("Error:", error));
  };

  // Mark task as completed
  window.completeTask = (taskId) => {
    fetch(`/complete/${taskId}`, { method: "PUT" })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        loadTasks();
      })
      .catch((error) => console.error("Error:", error));
  };

  // Mark task as "In Progress"
  window.markInProgress = (taskId) => {
    fetch(`/in-progress/${taskId}`, { method: "PUT" })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        loadTasks();
      })
      .catch((error) => console.error("Error:", error));
  };

  // Calculate days left until the due date
  function calculateDaysLeft(dueDate) {
    const currentDate = new Date();
    const dueDateObj = new Date(dueDate);
    const timeDifference = dueDateObj - currentDate;
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  }

  // Show the task management section after login
  // function showTaskSection() {
  //   registerSection.style.display = "none";
  //   registerPrompt.style.display = "none";
  //   showRegister.style.display = "none";
  //   loginForm.style.display = "none";
  //   registerForm.style.display = "none";
  //   loginText.style.display = "none";
  //   registerText.style.display = "none";
  //   taskSection.style.display = "block";
  // }

  // Logout
  logoutBtn.addEventListener("click", () => {
    fetch("/logout")
      .then(() => {
        alert("Logged out successfully");
        window.location.href = "/"; // Redirect to login
      })
      .catch((error) => console.error("Error:", error));
  });
});
