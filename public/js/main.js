const loadData = async function () {
  const response = await fetch('/data'); // Ensure you're fetching from the correct endpoint
  if (response.ok) {
    const data = await response.json();

    const tableBody = document.querySelector('#employeeTableBody');
    tableBody.innerHTML = '';

    data.forEach((entry) => {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td>
          <label for="employeeid-${entry.employeeid}">Employee ID</label>
          <input type="text" id="employeeid-${entry.employeeid}" value="${entry.employeeid}" disabled />
        </td>
        <td>
          <label for="name-${entry.employeeid}">Name</label>
          <input type="text" id="name-${entry.employeeid}" value="${entry.name}" disabled />
        </td>
        <td>
          <label for="salary-${entry.employeeid}">Salary</label>
          <input type="text" id="salary-${entry.employeeid}" value="${entry.salary}" disabled />
        </td>
        <td>
          <label for="regdate-${entry.employeeid}">ID Registration Year</label>
          <input type="text" id="regdate-${entry.employeeid}" value="${entry.regdate}" disabled />
        </td>
        <td>${entry.expdate}</td>
        <td>
          <button class="editBtn">Edit</button>
          <button class="deleteBtn">Delete</button>
        </td>
      `;
      newRow.querySelector('.editBtn').onclick = () => toggleEdit(newRow, entry.employeeid);
      newRow.querySelector('.deleteBtn').onclick = () => deleteRow(entry.employeeid);
      tableBody.appendChild(newRow);
    });
  } else {
    console.error('Failed to load data');
  }
};

const toggleEdit = function (row, employeeid) {
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

    fetch(`/edit/${employeeid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    }).then(response => {
      if (response.ok) {
        loadData(); // Reload data to reflect changes
      } else {
        console.error('Failed to save changes');
      }
    });
    
    inputs.forEach(input => input.disabled = true);
    editBtn.textContent = 'Edit';
  }
};

const deleteRow = function (employeeid) {
  fetch(`/delete/${employeeid}`, {
    method: 'DELETE'
  }).then(response => {
    if (response.ok) {
      loadData(); // Reload data to reflect deletion
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
    name: yourName, // Changed this to "name"
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
    await loadData(); // Refresh the table with updated data
    document.querySelector('#employeeForm').reset(); // Reset the form
  } else {
    console.error('Failed to submit data');
  }
};

window.onload = function () {
  const form = document.querySelector('#employeeForm');
  form.onsubmit = submit;
  loadData(); // Load initial data on page load
};
