const button = document.getElementById("input-button");
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

document.addEventListener("DOMContentLoaded", function() { //Load the tasks when the page loads
    fetchTasks();  
});

function fetchTasks() { //Get the tasks from the db according to who the user is
    fetch('/tasks')
    .then(response => response.json())
    .then(tasks => {
        console.log("Fetched tasks:", tasks);
        renderTasks(tasks);  
    });
}

function renderTasks(tasks) { //Need to display all of the tasks when the page loads
    tasks.forEach(task => {
        const li = document.createElement("li");
        li.dataset.id = task._id;  
        li.innerHTML = `
        <label>
            <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''}>
            <span class="taskSpan" style="text-decoration: ${task.completed ? 'line-through' : 'none'};">${task.task}</span>
        </label>
            <div class="button-container">
                <span class="editButton">edit</span>
                <span class="deleteButton">delete</span>
            </div>`;
        
        listContainer.appendChild(li);

        const checkBox = li.querySelector(".checkbox");
        const editButton = li.querySelector(".editButton");
        const deleteButton = li.querySelector(".deleteButton");
        const taskSpan = li.querySelector(".taskSpan");

        checkBox.addEventListener("click", function() {
            taskSpan.style.textDecoration = checkBox.checked ? "line-through" : "none";
        });

        editButton.addEventListener("click", function() {
            const userInput = prompt("Edit task:", taskSpan.textContent);
            if (userInput !== null) {
                taskSpan.textContent = userInput;
            }
        });

        deleteButton.addEventListener("click", function() {
            const confirmPrompt = confirm("Are you sure you want to delete this task?");
            if (confirmPrompt) {
                li.remove();
                deleteTask(task._id); 
            }
        });
    });
}

function addTask() {
  const task = inputBox.value
  if (!task) {
    alert("Please insert a task before submitting")
    return;
  }

  const li = document.createElement("li")
  li.innerHTML = `
  <label><input type="checkbox" class="checkbox"></label>
    <span class="taskSpan">${task}</span>
  <div class="button-container">
    <span class="editButton">edit</span>
    <span class="deleteButton">delete</span>
  </div>`
  listContainer.appendChild(li)
  inputBox.value = ""

  fetch('/addTask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task })
})
.then(response => response.text())
.then(data => {
    console.log('Task added:', data);
});

  const checkBox = li.querySelector(".checkbox")
  const editButton = li.querySelector(".editButton")
  const deleteButton = li.querySelector(".deleteButton")
  const taskSpan = li.querySelector(".taskSpan")
  
  checkBox.addEventListener("click", function() {
    if (checkBox.checked) {
      taskSpan.style.textDecoration = "line-through"
    }
    else {
      taskSpan.style.textDecoration = "none"
    }
  });
  editButton.addEventListener("click", function() {
    const userInput = prompt("Edit task:", taskSpan.textContent);
        if (userInput !== null) {
          taskSpan.textContent = userInput;
          li.classList.remove("completed");
      }
  });
  
  deleteButton.addEventListener("click", function() {
    const confirmPrompt = confirm("Are you sure you want to delete this task?")
    if (confirmPrompt) {
      li.remove();
      deleteTask(task._id)
    }
         });
        }
    

function deleteTask(taskId) {
    fetch('/deleteTask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId })
    })
    .then(response => response.text())
    .then(data => {
        console.log('Task deleted:', data);
    })
    .catch(err => console.error('Error deleting task:', err));
}


