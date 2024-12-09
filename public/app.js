document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const studentForm = document.getElementById('studentForm');
  const deleteForm = document.getElementById('deleteForm');
  const studentTableBody = document.querySelector('#studentTable tbody');

  loginForm.addEventListener('submit', event => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    console.log(`Logging in with username: ${username}`);

    fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    }).then(response => {
      if (response.ok) {
        console.log('Login successful');
        fetchData();
      } else {
        console.log('Login failed');
        alert('Login failed');
      }
    }).catch(error => {
      console.error('Login error:', error);
    });
  });

  function fetchData() {
    console.log('Fetching student data...');

    fetch('/data', {
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache' }  // Prevent caching
    })
    .then(response => {
      if (!response.ok) {
        console.error('Failed to fetch data:', response.status);
        throw new Error('Failed to fetch data');
      }
      return response.json();
    })
    .then(data => {
      if (!Array.isArray(data)) {
        console.error('Fetched data is not an array:', data);
        return;
      }
      console.log('Student data fetched:', data);
      
      // Clear existing table rows
      studentTableBody.innerHTML = '';
      
      // Append new rows to the table
      data.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${student.name}</td>
          <td>${student.age}</td>
          <td>${student.year}</td>
          <td>${student.grade}</td>
          <td>${student.status}</td>
        `;
        studentTableBody.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Error fetching student data:', error);
    });
  }

  studentForm.addEventListener('submit', event => {
    event.preventDefault();
    const newStudent = {
      name: document.getElementById('name').value,
      age: parseInt(document.getElementById('age').value),
      year: parseInt(document.getElementById('year').value),
      grade: parseInt(document.getElementById('grade').value),
      action: 'add'
    };

    console.log('Adding/updating student:', newStudent);

    fetch('/student', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStudent)
    }).then(response => {
      if (response.ok) {
        console.log('Student added/updated successfully');
        fetchData();  // Refresh the student list
      } else {
        console.error('Error adding/updating student:', response.status);
        alert('Error adding/updating student');
      }
    }).catch(error => {
      console.error('Error adding/updating student:', error);
    });
  });

  deleteForm.addEventListener('submit', event => {
    event.preventDefault();
    const deleteName = document.getElementById('deleteName').value;

    console.log('Deleting student:', deleteName);

    fetch('/student', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: deleteName, action: 'delete' })
    }).then(response => {
      if (response.ok) {
        console.log('Student deleted successfully');
        fetchData();  // Refresh the student list
      } else {
        console.error('Error deleting student:', response.status);
        alert('Error deleting student');
      }
    }).catch(error => {
      console.error('Error deleting student:', error);
    });
  });

  fetchData();  // Fetch student data on page load
});






