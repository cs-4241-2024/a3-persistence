// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const input = document.querySelector( '#yourname' ),
        json = { yourname: input.value },
        body = JSON.stringify( json )

  const response = await fetch( '/submit', {
    method:'POST',
    body 
  })

  const text = await response.text()

  console.log( 'text:', text )
}

window.addEventListener('load', function() {
  fetch( '/getHabits' ).then( ( response ) => response.json() ).then(habits => {
    loadTable(habits)}).catch( error => console.log(error) );
});

const loadTable = function(habits) {
  const tableBody = document.getElementById('table-body');
  tableBody.innerHTML = '';

  habits.forEach( habit => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${habit.habitName}</td>
        <td>${habit.startDate}</td>
        <td>${habit.frequency}</td>
        <td>${habit.consistency}</td>
        <td><button class="delete-btn" data-habitname="${habit.habitName}">Delete</button></td>
      `;
    tableBody.append(row);
  });
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', function() {
      const habitName = this.getAttribute('data-habitname');
      deleteHabit(habitName);
    });
  });
}

window.onload = function() {
   const button = document.querySelector("button");
  button.onclick = submit;
}

document.getElementById('habit-form').addEventListener('submit', function (event) {
  event.preventDefault();
  const habitName = document.getElementById('habit-name').value;
  const startDate = document.getElementById('start-date').value;
  const frequency = document.getElementById('frequency').value;

  const newHabit = {
    habitName: habitName,
    startDate: startDate,
    frequency: frequency
  };

  fetch('/addHabit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newHabit)
  }).then(response => response.json()).then(updatedData => {
    document.getElementById('habit-form').reset();
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';

    updatedData.forEach( (habit) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${habit.habitName}</td>
        <td>${habit.startDate}</td>
        <td>${habit.frequency}</td>
        <td>${habit.consistency}</td>
        <td><button class="delete-btn" data-habitname="${habit.habitName}">Delete</button></td>
      `;

      tableBody.append(row);
    });
  }).catch(error => {
    console.error(error);
  })
});

const deleteHabit = async function(habitName) {
  const response = await fetch(`/deleteHabit`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({habitName})
  });

  const newData = await response.json();
  loadTable(newData);
}