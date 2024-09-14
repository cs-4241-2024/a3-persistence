// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault();

  const mood = document.querySelector('#mood').value;
  const comment = document.querySelector('#comment').value;
  const name = document.querySelector('#name').value;

  if (!mood || !name){
    alert('Please fill in all the required fields.');
    return;
  }

  const json = {name, mood, comment};

  const response = await fetch( '/add-mood', {
    method:'POST',
    body: JSON.stringify(json),
    headers: {'Content-Type': 'application/json'}
  });

  const updatedMoods = await response.json();

  updateTable(updatedMoods);
  console.log( 'text:', updatedMoods );

  //clear the form fields
  document.querySelector('#name').value = '';
  document.querySelector('#mood').selectedIndex = 0;
  document.querySelector('#comment').value = '';
};

const updateTable = function(moods){
  const tbody = document.querySelector('#moodTable tbody');
  tbody.innerHTML = '';

  moods.forEach(mood => {
    const row = document.createElement('tr');

    row.innerHTML = `
    <td>${mood.name}</td>
    <td>${mood.mood}</td>
    <td>${mood.comment || ''}</td>
    <td>${mood.timestamp}</td>
    <td>${mood.moodScore}</td>
    <td><button data-id="${mood.id}" class="delete-btn">Delete</button></td>
    `;

    tbody.appendChild(row);
  });

  document.querySelectorAll('.delete-btn').forEach(button => {
    button.onclick = async function() {
      const id = this.dataset.id;
      console.log(`id is ${id}`)
      await fetch(`/delete-mood/${id}`, {method: 'DELETE'});

      const response = await fetch('/results');
      const updateMoods = await response.json();
      updateTable(updateMoods);
    };
  });
  
};

window.onload = async function() {
  const response = await fetch('./results');
  const moods = await response.json();
  updateTable(moods);

  const form = document.querySelector("form");
  form.onsubmit = submit;
}