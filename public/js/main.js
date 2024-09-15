const submit = async function (event) {
  event.preventDefault();

  const inputTask = document.querySelector('#task');
  const inputDescription = document.querySelector('#description');
  const inputPriority = document.querySelector('#priority');

  const newItem = {
    task: inputTask.value,
    description: inputDescription.value,
    priority: inputPriority.value,
    created_at: new Date().toISOString()
  };

  const response = await fetch('/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newItem)
  });

  const data = await response.json();
  updateTable(data);
};

const deleteItem = async function (id) {
  const response = await fetch(`/delete/${id}`, {
    method: 'DELETE'
  });

  const data = await response.json();
  updateTable(data);
};

const updateTable = function (data) {
  const resultsTable = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
  resultsTable.innerHTML = '';

  data.forEach(item => {
    const row = resultsTable.insertRow();
    const taskCell = row.insertCell(0);
    const descriptionCell = row.insertCell(1);
    const priorityCell = row.insertCell(2);
    const createdAtCell = row.insertCell(3);
    const dueDateCell = row.insertCell(4);
    const actionCell = row.insertCell(5);

    taskCell.textContent = item.task;
    priorityCell.textContent = item.priority;
    descriptionCell.textContent = item.description;
    createdAtCell.textContent = new Date(item.created_at).toLocaleDateString();
    dueDateCell.textContent = item.due_date || 'No Due Date';

    taskCell.onclick = () => makeEditable(taskCell, 'task', item.id);
    descriptionCell.onclick = () => makeEditable(descriptionCell, 'description', item.id);
    priorityCell.onclick = () => makePriorityEditable(priorityCell, item.id);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteItem(item.id);
    actionCell.appendChild(deleteButton);
  });
};

const makeEditable = function (cell, field, id) {
  const originalText = cell.textContent;
  const input = document.createElement('input');
  input.type = 'text';
  input.value = originalText;
  cell.innerHTML = '';
  cell.appendChild(input);
  input.focus();

  // Make input field match cell dimensions
  input.style.width = '100%';
  input.style.boxSizing = 'border-box';

  input.onblur = async function () {
    const newValue = input.value;
    cell.innerHTML = newValue;

    const updatedItem = { id, [field]: newValue, created_at: new Date().toISOString() };
    await fetch('/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedItem)
    });

    const response = await fetch('/data');
    const data = await response.json();
    updateTable(data);
  };

  input.onkeypress = function (event) {
    if (event.key === 'Enter') {
      input.blur();
    }
  };
};

const makePriorityEditable = function (cell, id) {
  const originalText = cell.textContent;
  const select = document.createElement('select');

  ['Low', 'Medium', 'High'].forEach(priority => {
    const option = document.createElement('option');
    option.value = priority;
    option.textContent = priority;
    if (priority === originalText) {
      option.selected = true;
    }
    select.appendChild(option);
  });

  cell.innerHTML = '';
  cell.appendChild(select);
  select.focus();


  select.style.width = '100%';
  select.style.boxSizing = 'border-box';

  select.onblur = select.onchange = async function () {
    const newValue = select.value;
    cell.innerHTML = newValue;

    const updatedItem = { id, priority: newValue, created_at: new Date().toISOString() };
    await fetch('/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedItem)
    });

    const response = await fetch('/data');
    const data = await response.json();
    updateTable(data);
  };
};

window.onload = async function () {
  const button = document.querySelector("button[type='submit']");
  button.onclick = submit;

  const response = await fetch('/data');
  const data = await response.json();
  updateTable(data);
};