// // FRONT-END (CLIENT) JAVASCRIPT HERE
let selectedRowId = null;


const makeRequest = async function(todo, Atype, Adate) {
  let json = {};
  if (todo) {
    json = { ToDo: todo , type: Atype, date: Adate };
  }

  const body = JSON.stringify(json);
  const response = await fetch('/submit', {
    method: 'POST',
    body
  });

  const text = await response.json();
  updateTable(text);
};

// Function to delete a row
const deleteRow = async function(id) {
  const body = JSON.stringify({ id }); // Send the id or index of the row to delete
  const response = await fetch('/delete', {
    method: 'DELETE',
    body
  });

  const text = await response.json();
  updateTable(text);
};


const updateTable = function(data) {
  var table = document.getElementById("myList");
  table.querySelectorAll("tr:not(:first-child)").forEach(row => row.remove());

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const row = table.insertRow();

    row.insertCell(0).textContent = item.ToDo;
    row.insertCell(1).textContent = item.type;
    row.insertCell(2).textContent = item.date;
    row.insertCell(3).textContent = item.priority;

    const deleteCell = row.insertCell(4);
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteRow(i); // Send the index to the delete function
    deleteCell.appendChild(deleteButton);

    // const editCell = row.insertCell(5);
    // const editButton = document.createElement('button');
    // editButton.className = 'editButton';
    // editButton.textContent = 'Edit';
    // editButton.onclick = () => editRow(row);
    // editCell.appendChild(editButton);
  }
};

const submit = async function(event) {
  event.preventDefault();
  const input = document.querySelector('#ToDo');
  const input2 = document.querySelector('#type');
  const input3 = document.querySelector('#date');

  makeRequest(input.value, input2.value, input3.value);

  document.getElementById("ToDo").value = "";
  document.getElementById("date").value = "";
};

window.onload = function() {
  const submitButton = document.querySelector("#submitButton");
  submitButton.onclick = submit;

  makeRequest(); // Populate table initially
};

