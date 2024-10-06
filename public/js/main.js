window.onload = function () {
  const form = document.querySelector('#addEvent');
  const dueDayInput = document.querySelector('#dueDay');
  const creationDateInput = document.querySelector('#creationDate');
  const submitButton = document.querySelector('#submitButton');

  // Create an element to show the error message
  const errorMessage = document.createElement('div');
  errorMessage.style.color = 'red';
  errorMessage.style.display = 'none';  // Initially hidden
  errorMessage.innerHTML = "Check your date!";
  submitButton.parentNode.insertBefore(errorMessage, submitButton);  // Insert before submit button

  // Fetch and populate the table with tasks from MongoDB
  fetch('/docs', { method: 'GET' })
    .then((response) => response.json())
    .then((data) => {
      // Log the fetched data to confirm it's being retrieved correctly
      console.log('Fetched data from MongoDB:', data);
      document.getElementById("submittedTodo").innerHTML = "";  // Clear existing content
      data.forEach(task => refreshTodoList(task));  // Populate the table with tasks from MongoDB
    })
    .catch(error => console.error('Error fetching tasks:', error));

  // Add event listeners to validate dates
  dueDayInput.addEventListener('input', function () {
    validateDates();
  });

  creationDateInput.addEventListener('input', function () {
    validateDates();
  });

  // Form submission handler
  form.onsubmit = function(e) {
    e.preventDefault();
    if (validateDates()) {
      submit(e);
    }
  };

  // Function to validate if the due date is after the creation date
  function validateDates() {
    let creationDate = new Date(creationDateInput.value);
    let dueDate = new Date(dueDayInput.value);

    // If due date is before the creation date, show error
    if (dueDate < creationDate) {
      errorMessage.style.display = 'block';  // Show the error message
      return false;
    } else {
      errorMessage.style.display = 'none';   // Hide the error message
      return true;
    }
  }
};

// Submit the form and add a new task
const submit = function (e) {
  e.preventDefault();

  // Get the input values
  let task = document.querySelector("#task").value;
  let priority = document.querySelector("#priority").value;
  let creationDate = document.querySelector("#creationDate").value;
  let dueDay = document.querySelector("#dueDay").value;
  let dueTime = document.querySelector("#dueTime").value;

  // Create a task object
  let taskObj = {
    task: task,
    priority: priority,
    creationDate: creationDate,
    dueDate: dueDay,
    dueTime: dueTime,
    daysLeft: calculateDaysLeft(dueDay)
  };

  // Post the new task to the server
  fetch('/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskObj),  // Send the task object as JSON to the server
  })
  .then((response) => response.json()) // Get the inserted task (including the _id)
  .then((insertedTask) => {
    console.log('Inserted Task:', insertedTask);  // Log the full task object with all fields
    refreshTodoList(insertedTask);  // Use the task directly with the MongoDB _id
  })
  .catch(error => console.error('Error submitting task:', error));  
};

// Function to calculate days left
function calculateDaysLeft(dueDay) {
  let currentDate = new Date();
  let dueDate = new Date(dueDay);
  let timeDiff = dueDate.getTime() - currentDate.getTime();
  let daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysLeft > 0 ? daysLeft : 0;  // Return 0 if the due date has passed
}

// Function to refresh the todo list UI with tasks
function refreshTodoList(taskObj) {
  let todoListDiv = document.getElementById("submittedTodo");

  // Check if there's already a table, else create one
  let table = todoListDiv.querySelector("table");
  if (!table) {
    table = document.createElement("table");
    table.classList.add("centered-table"); 

    // Create the table header
    let tr = table.insertRow(-1);
    let thTask = document.createElement("th");
    thTask.innerHTML = "Task";
    tr.appendChild(thTask);
    let thPriority = document.createElement("th");
    thPriority.innerHTML = "Priority";
    tr.appendChild(thPriority);
    let thCreationDate = document.createElement("th");
    thCreationDate.innerHTML = "Creation Date";
    tr.appendChild(thCreationDate);
    let thDueDate = document.createElement("th");
    thDueDate.innerHTML = "Due Date";
    tr.appendChild(thDueDate);
    let thDaysLeft = document.createElement("th");
    thDaysLeft.innerHTML = "Days Left";
    tr.appendChild(thDaysLeft);
    let thActions = document.createElement("th");
    thActions.innerHTML = "Actions";
    tr.appendChild(thActions);

    // Append the table to the div
    todoListDiv.appendChild(table);
  }

  // Add a new row for the new task
  let tr = table.insertRow(-1);

  // Add the task data to the table
  let tdTask = tr.insertCell(-1);
  tdTask.innerHTML = taskObj.task;

  let tdPriority = tr.insertCell(-1);
  tdPriority.innerHTML = taskObj.priority;

  let tdCreationDate = tr.insertCell(-1);
  tdCreationDate.innerHTML = taskObj.creationDate;

  let tdDueDate = tr.insertCell(-1);
  tdDueDate.innerHTML = taskObj.dueDate;

  let tdDaysLeft = tr.insertCell(-1);
  tdDaysLeft.innerHTML = taskObj.daysLeft;

  // Add a delete button
  let tdActions = tr.insertCell(-1);
  let deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "Delete Task";
  deleteBtn.onclick = function () {
    deleteTask(taskObj._id, tr);  // Pass the task's _id and the row element to delete
  };

  tdActions.appendChild(deleteBtn);

}

// Function to delete a task
// Updated deleteTask function to use the task's _id
function deleteTask(taskId, rowElement) {
  console.log("Deleting task with _id:", taskId);
  fetch('/remove', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ _id: taskId }),  // Send the _id of the task to the backend
  })
  .then(response => response.json())
  .then(data => {
    console.log('Updated tasks after deletion:', data);
    rowElement.remove();  // Remove the row from the table after successful deletion
  })
  .catch(error => {
    console.error('Error deleting task:', error);
  });
}
