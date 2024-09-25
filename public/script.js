const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const taskName = document.getElementById("taskName").value;
    const dueDate = document.getElementById("dueDate").value;
    const userName = document.getElementById("userName").value;

    try {
        const response = await fetch("/addTask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: taskName, dueDate, user: userName }),
        });

        if (response.ok) {
            loadTasks(userName);
        } else {
            alert("Error adding task");
        }

        taskForm.reset();
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while adding the task.");
    }
});

async function loadTasks(user) {
    try {
        const response = await fetch(`/tasks/${user}`);
        const tasks = await response.json();
        taskList.innerHTML = "";

        tasks.forEach((task) => {
            const li = document.createElement("li");
            li.classList.add("list-group-item");
            li.textContent = `${task.name} - Due: ${new Date(task.dueDate).toLocaleDateString()}`;
            li.innerHTML += ` <button class="btn btn-danger btn-sm float-end" onclick="deleteTask('${task._id}')">Delete</button>`;
            taskList.appendChild(li);
        });
    } catch (error) {
        console.error("Error loading tasks:", error);
    }
}

async function deleteTask(id) {
    try {
        const response = await fetch(`/deleteTask/${id}`, { method: "DELETE" });
        if (response.ok) {
            const userName = document.getElementById("userName").value;
            loadTasks(userName);
        } else {
            alert("Error deleting task");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while deleting the task.");
    }
}

document.getElementById("userName").addEventListener("change", function () {
    loadTasks(this.value);
});
