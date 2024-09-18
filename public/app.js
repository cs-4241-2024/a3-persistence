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
    fetch('/data')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.error('Failed to fetch data:', response.status);
          throw new Error('Failed to fetch data');
        }
      })
      .then(data => {
        console.log('Student data fetched:', data);
        studentTableBody.innerHTML = '';
        data.forEach(student => {
          const row = `<tr>
                          <td>${student.name}</td>
                          <td>${student.age}</td>
                          <td>${student.year}</td>
                          <td>${student.grade}</td>
                          <td>${student.status}</td>
                      </tr>`;
          studentTableBody.innerHTML += row;
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
        fetchData();
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
        fetchData();
      } else {
        console.error('Error deleting student:', response.status);
        alert('Error deleting student');
      }
    }).catch(error => {
      console.error('Error deleting student:', error);
    });
  });

  fetchData();
});






