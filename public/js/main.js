document.addEventListener('DOMContentLoaded', function () {
    // Handle registration form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            fetch('/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ username, password })
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(json => {
                        throw new Error(json.message || 'Failed to register');
                    });
                }
                return response.json();
            })
            .then(data => {
                alert(data.message);
                if (data.status === 201) {
                    window.location.href = '/login.html'; // Redirect on successful registration
                }
            })
            .catch(error => {
                console.error('Submission error:', error);
                alert('Failed to submit entry, please try again. Error: ' + error.message);
            });
        });
    }


    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            fetch('/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ username, password })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                if (response.headers.get("content-type")?.includes("application/json")) {
                    return response.json(); // This assumes the server sends a JSON response on successful login
                } else {
                    // If we're not getting JSON, it means we're redirected to an HTML page
                    window.location.href = response.url;
                    return null;
                }
            })
            .then(data => {
                if (data && data.status === 'success') {
                    window.location.href = 'index.html'; // Redirect on successful JSON response
                } else if (data) {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Failed to login:', error.message);
                alert('Login failed, please try again.');
            });
        });
    }

    // Handle journal entry submission
    const journalForm = document.getElementById('journalForm');
    if (journalForm) {
        journalForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const title = document.getElementById('journalTitle').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const entry = document.getElementById('journalEntry').value;

            fetch('/submitEntry', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ title, date, time, entry })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Server responded with an error!');
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    console.log('Entry submitted successfully!');
                    addEntryToTable(data.entry);
                } else {
                    throw new Error(data.message || 'Failed to submit entry.');
                }
            })
            .catch(error => {
                console.error('Submission error:', error);
                alert('Failed to submit entry, please try again.');
            });
        });
    }

    // Function to add entry to the table
    function addEntryToTable(entry) {
        const table = document.getElementById('entriesTable');
        const row = table.insertRow();
        const titleCell = row.insertCell(0);
        const dateCell = row.insertCell(1);
        const timeCell = row.insertCell(2);
        const entryCell = row.insertCell(3);
        const nextEntryCell = row.insertCell(4);
        const actionsCell = row.insertCell(5);

        titleCell.contentEditable = "true";
        dateCell.contentEditable = "true";
        timeCell.contentEditable = "true";
        entryCell.contentEditable = "true";
        nextEntryCell.textContent = new Date(entry.date + ' ' + entry.time).addHours(24).toISOString();

        titleCell.textContent = entry.title;
        dateCell.textContent = entry.date;
        timeCell.textContent = entry.time;
        entryCell.textContent = entry.entry;

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.onclick = () => saveEntry(entry._id, titleCell.textContent, dateCell.textContent, timeCell.textContent, entryCell.textContent);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function () {
            fetch('/deleteEntry', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ id: entry._id })
            }).then(response => response.json())
              .then(data => {
                  if (data.status === 'success') {
                      row.remove();
                  } else {
                      alert(data.message);
                  }
              });
        };
        actionsCell.appendChild(saveButton);
        actionsCell.appendChild(deleteButton);
    }
  
    function saveEntry(id, title, date, time, entryText) {
        fetch('/updateEntry', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id, title, date, time, entry: entryText })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Entry updated successfully');
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error updating entry:', error);
            alert('Failed to update entry, please try again.');
        });
    }



    // Extend Date object to add hours
    Date.prototype.addHours = function(h) {
        this.setTime(this.getTime() + (h*60*60*1000));
        return this;
    }
});

