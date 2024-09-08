document.addEventListener('DOMContentLoaded', () => {
    const studentForm = document.getElementById('studentForm');
    const deleteForm = document.getElementById('deleteForm');
    const studentTableBody = document.querySelector('#studentTable tbody');

    function fetchData() {
        fetch('/data')
            .then(response => response.json())
            .then(data => {
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

        fetch('/student', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newStudent)
        }).then(() => fetchData());
    });

    deleteForm.addEventListener('submit', event => {
        event.preventDefault();
        const deleteName = document.getElementById('deleteName').value;

        fetch('/student', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: deleteName, action: 'delete' })
        }).then(() => fetchData());
    });

    fetchData();
});

function deleteStudent(name) {
    fetch('/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, action: 'delete' })
    }).then(() => fetchData());
}
