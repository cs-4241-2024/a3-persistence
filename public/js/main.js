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

  let taskObj = {};
  fetch( '/', { // fetch is where you specify the url/ resouce that you want to see
    method:'POST',
    body: JSON.stringify(taskObj),// send body to server
  }).then((response) => response.json())
  .then((data) => {
      // this is the response from the server
      console.log(data)
      for (i = 0; i < data.length; i++){
        refreshTodoList(data[i]);
      }
    })
 

  // Add event listener to the due date input
  dueDayInput.addEventListener('input', function () {
      validateDates();
  });

  creationDateInput.addEventListener('input', function () {
      validateDates();
  });

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

// Existing submit and refreshTodoList functions (no changes needed)
const submit = function (e) {
  // Prevent default form action
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
    daysLeft: 0
};

// Convert the object to a JSON string
let jsonTaskObj = JSON.stringify(taskObj);

let todoListDiv = document.getElementById("submittedTodo");
let table = todoListDiv.querySelector("table");
console.log(jsonTaskObj)
if (table) {
  table.remove();
}

  // post
  fetch( '/submit', { // fetch is where you specify the url/ resouce that you want to see
    method:'POST',
    headers: {'Content-Type': 'application/json'},
    body: jsonTaskObj,// send body to server
  }).then((response) => response.json())
  .then((data) => {
      // this is the response from the server
      console.log(data)
      for (i = 0; i < data.length; i++){
        refreshTodoList(data[i]);
        console.log(data[i]);
      }
      console.log(taskObj)
    })
 
};



function refreshTodoList(taskObj) {
  // Get the div where the tasks will be displayed
  let todoListDiv = document.getElementById("submittedTodo");

  // Check if there's already a table, else create one
  let table = todoListDiv.querySelector("table");
  if (!table) {
      table = document.createElement("table");
      table.setAttribute('border', '1');
      table.setAttribute('width', '100%');

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
  deleteBtn.innerHTML = "Delete";
  deleteBtn.onclick = function () {
    let taskToDelete = {
      task: taskObj.task
    };
    console.log(taskObj.task);
  
    let jsonTaskToDelete = JSON.stringify(taskToDelete);
  
    fetch('/delete', {
      method: 'POST',
      body: jsonTaskToDelete,
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      tr.remove();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };
  
  tdActions.appendChild(deleteBtn);

  // Append the table to the div
  todoListDiv.innerHTML = "";
  todoListDiv.appendChild(table);
}
