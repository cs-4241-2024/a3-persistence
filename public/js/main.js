const submit = async function (event) {
  event.preventDefault();

  const taskInput = document.querySelector("#task").value;
  const priorityInput = document.querySelector("#priority").value;

  const taskData = {
    task: taskInput,
    priority: priorityInput,
  };

  try {
    const response = await fetch("/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });

    if (response.ok) {
      loadTasks();
      document.querySelector("#task").value = ""; // Clear task input field
      document.querySelector("#priority").value = "Low"; // Reset priority to default
    } else {
      alert("Failed to add task");
    }
  } catch (error) {
    alert("An error occurred: " + error.message);
  }
};

const loadTasks = async function () {
  try {
    const response = await fetch("/tasks");
    if (!response.ok) {
      alert("Error loading tasks");
      return;
    }

    const tasks = await response.json();
    const tableBody = document.querySelector("#taskTable tbody");
    tableBody.innerHTML = "";

    tasks.forEach((task) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${task.task}</td>
        <td>${task.priority}</td>
        <td>${new Date(task.creationDate).toLocaleString()}</td>
        <td><button class="delete-btn" data-id="${
          task._id
        }">Delete</button></td>
      `;
      tableBody.appendChild(row);
    });

    // Attach event listeners for delete buttons after rows are generated
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", function () {
        deleteTask(this.dataset.id);
      });
    });
  } catch (error) {
    alert("An error occurred while loading tasks: " + error.message);
  }
};

const deleteTask = async function (id) {
  try {
    const response = await fetch(`/tasks/${id}`, { method: "DELETE" });

    if (response.ok) {
      loadTasks();
    } else {
      alert("Failed to delete task");
    }
  } catch (error) {
    alert("An error occurred while deleting task: " + error.message);
  }
};

window.onload = function () {
  document.querySelector("#taskForm").onsubmit = submit;
  loadTasks();
};
