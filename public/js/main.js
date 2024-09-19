let appdata = [];

const fetchData = async function() {
  try {
    const response = await fetch('/data', {
      credentials: 'include'
    });
    if (!response.ok) {
      if (response.status === 401) {
        console.log('User not authenticated, redirecting to login');
        window.location.href = '/login.html'; // Ensure this is the correct path to your login page
      }
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    appdata = data;
    loadTable();
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

const submitData = async function(data) {
  try {
    const response = await fetch('/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      credentials: 'include'
    });
    if (!response.ok) {
      if (response.status === 401) {
        console.log('User not authenticated, redirecting to login');
        window.location.href = '/login.html'; // Ensure this is the correct path to your login page
      }
      throw new Error('Network response was not ok');
    }
    const result = await response.json();
    console.log('Submit result:', result);
  } catch (error) {
    console.error('Submit error:', error);
  }
};

const submit = function(event) {
  event.preventDefault();

  const name = document.querySelector('#name').value;
  const points = document.querySelector('#points').value;
  const score = document.querySelector('#score').value;
  const difficulty = document.querySelector('#difficulty').value;
  const data = { name, points, score, difficulty };

  submitData(data);
  appdata.push(data);
  loadTable();
};

document.querySelector('form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      credentials: 'include'
    });

    if (response.redirected) {
      window.location.href = response.url;
    } else {
      const result = await response.json();
      console.error('Login error:', result.error);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
});

window.onload = function() {
  const form = document.querySelector('#dataForm');
  form.onsubmit = submit;
  fetchData();
};

const loadTable = function() {
  const tableBody = document.querySelector('#dataTable tbody');
  tableBody.innerHTML = '';
  appdata.forEach((row, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.name}</td>
      <td>${row.points}</td>
      <td>${row.score}</td>
      <td>${row.difficulty}</td>
      <td>
        <button onclick="editData(${index})">Edit</button>
        <button onclick="deleteData(${index})">Delete</button>
      </td>`;
    tableBody.appendChild(tr);
  });
};

const editData = function(index) {
  const data = appdata[index];
  document.querySelector('#name').value = data.name;
  document.querySelector('#points').value = data.points;
  document.querySelector('#score').value = data.score;
  document.querySelector('#difficulty').value = data.difficulty;
  document.querySelector('#dataForm').onsubmit = function(event) {
    event.preventDefault();
    updateData(index);
  };
};

const updateData = async function(index) {
  const data = appdata[index];
  const updatedData = {
    _id: data._id,
    name: document.querySelector('#name').value,
    points: document.querySelector('#points').value,
    score: document.querySelector('#score').value,
    difficulty: document.querySelector('#difficulty').value
  };

  try {
    const response = await fetch('/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData),
      credentials: 'include'
    });
    const result = await response.json();
    if (result.modifiedCount === 1) {
      appdata[index] = updatedData;
      loadTable();
    } else {
      console.error('Failed to update data');
    }
  } catch (error) {
    console.error('Update error:', error);
  }

  document.querySelector('#dataForm').onsubmit = submit;
};

const deleteData = async function(index) {
  const data = appdata[index];
  try {
    const response = await fetch('/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ _id: data._id }),
      credentials: 'include'
    });
    const result = await response.json();
    if (result.deletedCount === 1) {
      appdata.splice(index, 1);
      loadTable();
    } else {
      console.error('Failed to delete data');
    }
  } catch (error) {
    console.error('Delete error:', error);
  }
};

window.onload = function() {
  const form = document.querySelector('#dataForm');
  form.onsubmit = submit;
  fetchData();
};