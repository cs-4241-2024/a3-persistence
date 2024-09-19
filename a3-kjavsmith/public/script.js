document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todo-form');
    const todoTableBody = document.getElementById('todo-table-body');

    // Fetch and display all todos
    const fetchTodos = () => {
        fetch('/todos')
            .then(response => response.json())
            .then(data => {
                renderTodos(data);
            })
            .catch(err => console.error('Error fetching todos:', err));
    };

    // Handle form submission to add a new task
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const task = document.getElementById('task').value;
        const priority = document.getElementById('priority').value;
        const deadline = document.getElementById('deadline').value;

        fetch('/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task, priority, deadline }),
        })
        .then(response => response.json())
        .then(data => {
            form.reset();
            renderTodos(data);
        })
        .catch(err => console.error('Error adding task:', err));
    });

    // Delete a task and refresh the UI
    window.deleteTask = (id) => {
        fetch(`/delete/${id}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            renderTodos(data);
        })
        .catch(err => console.error('Error deleting task:', err));
    };

    // Edit a task
    window.editTask = (id) => {
        const task = prompt('Enter new task:');
        const priority = prompt('Enter new priority (1-5):');
        const deadline = prompt('Enter new deadline (yyyy-mm-dd):');

        fetch(`/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task, priority, deadline }),
        })
        .then(response => response.json())
        .then(data => {
            renderTodos(data);
        })
        .catch(err => console.error('Error editing task:', err));
    };

    // Render the list of todos in the table
    const renderTodos = (todos) => {
        todoTableBody.innerHTML = ''; // Clear the table
        todos.forEach(todo => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${todo.task}</td>
                <td>${todo.priority}</td>
                <td>${todo.deadline}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteTask('${todo._id}')">Delete</button>
                    <button class="btn btn-primary btn-sm" onclick="editTask('${todo._id}')">Edit</button>
                </td>
            `;
            todoTableBody.appendChild(tr);
        });
    };

    // Fetch all todos on initial load
    fetchTodos();
});
