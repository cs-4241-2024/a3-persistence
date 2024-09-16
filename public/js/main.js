// FRONT-END (CLIENT) JAVASCRIPT HERE

const showData = function (data) {
  const dataTable = document.querySelector('#dataTable');
  let innerHTMLString = `
  <tr>
    <th>Class Code</th>
    <th>Class Name</th>
    <th>Assignment</th>
    <th>Days Left</th>
    <th>Due Date</th>
  </tr>`;
  console.log("Data: ", data);
  data.forEach(element => {
    // const tableRow
    innerHTMLString += `<tr>
    <td>${element.classCode}</td>
    <td>${element.className}</td>
    <td>${element.assignment}</td>
    <td>${element.daysLeft}</td>
    <td>${element.dueDate}</td>
  </tr>`;
  });
  dataTable.innerHTML = innerHTMLString;
}

const getData = async function (event) {
  const response = await fetch('/data', {
    method: 'GET'
  });
  const json = await response.json();
  showData(json);
}


const submit = async function (event) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault();

  const classCode = document.querySelector('#Code').value;
  const className = document.querySelector('#Name').value;
  const assignment = document.querySelector('#Assignment').value;
  const daysLeft = document.querySelector('#Days').value;

  const newData = [{
    "classCode": classCode,
    "className": className,
    "assignment": assignment,
    "daysLeft": daysLeft
  }];



  const response = await fetch('/submit', {
    method: 'POST',
    body: JSON.stringify(newData)
  });

  const text = await response.text();

  console.log('text:', text);
  console.log("data:", newData);
  getData();
}

const deleteRow = async function (event) {
  const response = await fetch('/data', {
    method: 'DELETE'
  });
  const json = await response.json();
  showData(json);
}

window.onload = function () {
  document.querySelector('#submitButton').onclick = submit;
  document.querySelector('#deleteButton').onclick = deleteRow;
  getData();
}