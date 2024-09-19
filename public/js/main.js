document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector('#taskCreation');
  const taskBodyElement = document.querySelector('#taskBody');

  let taskTable = [];

  function fetchTask(list) {
    taskTable = list;
    taskBodyElement.innerHTML = "";
    taskTable.forEach((task, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${task.name}</td>
        <td>${task.task}</td>
        <td>${task.priority}</td>
        <td>${task.date}</td>
        <td><button class="delete-btn" data-index="${index}">Delete</button></td>
      `;
      taskBodyElement.appendChild(row);
    });
    addDelete();
  }
  
  function addDelete(){
    document.querySelectorAll('.delete-btn').forEach(button =>{
      button.addEventListener('click', () => {
        const i = event.target.getAttribute('data-index');
        deleteTask(i)
      })
    })
  }
  
  function deleteTask(i){
    fetch(`/deleteTask/${i}`,{
      method:'DELETE',
      headers:{
        "Content-Type":"application/json"
      },
    })
      .then((response) => response.json())
      .then((data)=>{
      fetchTask(data);
    })
     fetchTasks();
  }
  
  
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    
    const name = document.getElementById("yourname").value;
    const task = document.getElementById("task").value;
    const priority = document.getElementById("priority").value;
    const date = new Date().toLocaleString();

    fetch("/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, task, priority, date }),
    })
    .then((response) => response.text())
    .then(() => {
      fetchTasks(); 
      form.reset();
    });
  });

  function fetchTasks() {
    fetch("/getTask", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then((response) => response.json())
    .then((data) => {
      fetchTask(data);
    });
  }

  fetchTasks();
});
