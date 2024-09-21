// // FRONT-END (CLIENT) JAVASCRIPT HERE
let selectedRowId = null;


const makeRequest = async function(todo, Atype, Adate) {
  let json = {};
  if (todo) {
    json = { ToDo: todo , type: Atype, date: Adate };
  }

  const body = JSON.stringify(json);
  const response = await fetch('/add-doc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body
  });


  const text = await response.json();
  updateTable(text);
};

// Function to delete a row
const deleteRow = async function(id) {
  const body = JSON.stringify({ id }); // Send the id or index of the row to delete
  const response = await fetch('/delete-doc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body
  });

  const text = await response.json();
  updateTable(text);

};

const changeRow = async function(id) {
  console.log(id)
  var table = document.getElementById("myList");
  var row = table.rows[id+1];

  // document.getElementById('popupId').value = item._id;
  console.log(row.cells[0]);
  document.getElementById('popupToDo').value = row.cells[0].textContent;
  document.getElementById('popupType').value = row.cells[1].textContent;
  document.getElementById('popupDate').value = row.cells[2].textContent;
  document.getElementById('popupPriority').value = row.cells[3].textContent;

  document.getElementById('popup').classList.add('active');
  document.getElementById('popupOverlay').classList.add('active');
};

const closePopup = function() {
  document.getElementById('popup').classList.remove('active');
  document.getElementById('popupOverlay').classList.remove('active');
};


const saveChanges = async function() {
  const priority = document.getElementById('popupPriority').value;
  const ToDo = document.getElementById('popupToDo').value;
  const type = document.getElementById('popupType').value;
  const date = document.getElementById('popupDate').value;
  const newjson = { priority: priority, ToDo: ToDo, type: type, date: date };
  const body = JSON.stringify(newjson);
  const response = await fetch('/update-doc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body
  });

  const text = await response.json();
  updateTable(text);
  closePopup();
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
    const changeCell = row.insertCell(5)
    const deleteButton = document.createElement('button');
    const changeButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    changeButton.textContent = 'Change';
    
    deleteButton.onclick = () => deleteRow(i); // Send the index to the delete function
    changeButton.onclick = () => changeRow(i);
    deleteCell.appendChild(deleteButton);
    changeCell.appendChild(changeButton);

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
  const submitButton = document.getElementById("submitButton");
  submitButton.onclick = submit;

  document.querySelector("#saveButton").onclick = saveChanges;
  document.querySelector("#closeButton").onclick = closePopup;

  makeRequest(); // Populate table initially
};

