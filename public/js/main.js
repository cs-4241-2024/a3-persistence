const loadData = async function () {
  const response = await fetch('/docs');
  if (response.ok) {
    const data = await response.json();

    const tableBody = document.querySelector('#employeeTable tbody');
    tableBody.innerHTML = '';

    data.forEach((entry, index) => {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td>
          <label for="employeeid-${index}">Employee ID</label>
          <input type="text" id="employeeid-${index}" value="${entry.employeeid}" disabled />
        </td>
        <td>
          <label for="name-${index}">Name</label>
          <input type="text" id="name-${index}" value="${entry.name}" disabled />
        </td>
        <td>
          <label for="salary-${index}">Salary</label>
          <input type="text" id="salary-${index}" value="${entry.salary}" disabled />
        </td>
        <td>
          <label for="regdate-${index}">ID Registration Year</label>
          <input type="text" id="regdate-${index}" value="${entry.regdate}" disabled />
        </td>
        <td>${entry.expdate}</td>
        <td>
          <button class="editBtn">Edit</button>
          <button class="deleteBtn">Delete</button>
        </td>
      `;
      newRow.querySelector('.editBtn').onclick = () => toggleEdit(newRow, index);
      newRow.querySelector('.deleteBtn').onclick = () => deleteRow(index);
      tableBody.appendChild(newRow);
    });
  } else {
    console.error('Failed to load data');
  }
};

const toggleEdit = function (row, index) {
  const inputs = row.querySelectorAll('input');
  const editBtn = row.querySelector('.editBtn');

  if (editBtn.textContent === 'Edit') {
    inputs.forEach(input => input.disabled = false);
    editBtn.textContent = 'Save';
  } else {
    const updatedData = {
      employeeid: inputs[0].value,
      name: inputs[1].value,
      salary: inputs[2].value,
      regdate: inputs[3].value
    };

    fetch(`/edit/${index}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    }).then(response => {
      if (response.ok) {
        loadData();
      } else {
        console.error('Failed to save changes');
      }
    });
  }
};

const deleteRow = function (index) {
  fetch(`/delete/${index}`, {
    method: 'DELETE'
  }).then(response => {
    if (response.ok) {
      loadData();
    } else {
      console.error('Failed to delete row');
    }
  });
};

const submit = async function (event) {
  event.preventDefault();

  const employeeID = document.querySelector('#employeeid').value;
  const yourName = document.querySelector('#yourname').value;
  const salary = document.querySelector('#salary').value;
  const regDate = document.querySelector('#regdate').value;

  const data = {
    employeeid: employeeID,
    yourname: yourName,
    salary: salary,
    regdate: regDate
  };

  const response = await fetch('/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (response.ok) {
    await loadData();
    document.querySelector('#employeeForm').reset();
  } else {
    console.error('Failed to submit data');
  }
};

const getData = async () => {
  await fetch('/docs', {
  method: 'GET',
})}

window.onload = function () {
  const form = document.querySelector('#employeeForm');
  form.onsubmit = submit;
  loadData();
  //getData();
};
