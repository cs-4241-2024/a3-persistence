// FRONT-END (CLIENT) JAVASCRIPT HERE
let currentUserId = null;

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault();

  const mood = document.querySelector('#mood-dropdown').value;
  const comment = document.querySelector('#comment').value;
  const name = document.querySelector('#name').value;

  if (!mood || !name){
    alert('Please fill in all the required fields.');
    return;
  }
  if (!currentUserId){
    alert('You must be logged in to add a mood');
    return;
  }

  const json = {name, mood, comment, userId: currentUserId};

  const response = await fetch( '/add-mood', {
    method:'POST',
    body: JSON.stringify(json),
    headers: {'Content-Type': 'application/json'}
  });

  const updatedMoods = await response.json();

  updateTable(updatedMoods);

  //clear the form fields
  document.querySelector('#name').value = '';
  document.querySelector('#mood-dropdown').selectedIndex = 0;
  document.querySelector('#comment').value = '';
};

const login = async function (e){
  e.preventDefault();

  const loginInfo = {
    username: document.getElementById("login-username").value,
    password: document.getElementById("password").value
  };

  const body = JSON.stringify(loginInfo);

  const res = await fetch('/login', {
    method:'POST',
    body,
    headers: {'Content-Type': 'application/json'}
  });
  
  const response = await res.json();

  if (response.success) {
    currentUserId = response.userId;
    document.getElementById('login').style.display = 'none';
    document.getElementById('mood').style.display = 'block';

    // fetch user's moods after succesful login
    const moodsResponse = await fetch(`/results/${currentUserId}`);
    const moods = await moodsResponse.json();
    updateTable(moods);
  } else {
    alert('Invalid credentials, please try again');
  }

}

const updateTable = function(moods){
  const tbody = document.querySelector('#moodTable tbody');
  tbody.innerHTML = '';

  moods.forEach(mood => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td><input type="text" value="${mood.name}" disabled class="editable-name"></td>
      <td>
        <select class="editable-mood" disabled>
          <option value="happy" ${mood.mood === 'happy' ? 'selected' : ''}>Happy</option>
          <option value="sad" ${mood.mood === 'sad' ? 'selected' : ''}>Sad</option>
          <option value="stressed" ${mood.mood === 'stressed' ? 'selected' : ''}>Stressed</option>
          <option value="excited" ${mood.mood === 'excited' ? 'selected' : ''}>Excited</option>
          <option value="neutral" ${mood.mood === 'neutral' ? 'selected' : ''}>Neutral</option>
        </select>
      </td>
      <td><input type="text" value="${mood.comment || ''}" disabled class="editable-comment"></td>
      <td>${mood.timestamp}</td>
      <td>${mood.moodScore}</td>
      <td>
        <button data-id="${mood._id}" class="modify-btn">Modify</button>
        <button data-id="${mood._id}" class="delete-btn">Delete</button>
      </td>
    `;

    tbody.appendChild(row);
  });

  document.querySelectorAll('.modify-btn').forEach(button => {
    button.onclick = async function() {
      const row = this.closest('tr');
      const nameInput = row.querySelector('.editable-name');
      const moodSelect = row.querySelector('.editable-mood');
      const commentInput = row.querySelector('.editable-comment');
      const isEditing = !nameInput.disabled;
    

      if (isEditing){
        const updatedMood = {
          id: this.dataset.id,
          name: nameInput.value,
          mood: moodSelect.value,
          comment: commentInput.value,
          userId: currentUserId
        };
    
        await fetch(`/modify-mood/${updatedMood.id}`, {
          method: 'PUT',
          body: JSON.stringify(updatedMood),
          headers: {'Content-Type': 'application/json'}
        });

        const response = await fetch(`results/${currentUserId}`);
        const moods = await response.json();
        updateTable(moods);
      } else {
        nameInput.disabled = false;
        moodSelect.disabled = false;
        commentInput.disabled = false;
        this.textContent = "Save";
      }
    };
  });

  document.querySelectorAll('.delete-btn').forEach(button => {
    button.onclick = async function() {
      const id = this.dataset.id;
      await fetch(`/delete-mood/${id}/${currentUserId}`, {method: 'DELETE'});

      const response = await fetch(`/results/${currentUserId}`);
      const updateMoods = await response.json();
      updateTable(updateMoods);
    };
  });
  
};

window.onload = async function() {
  const loginForm = document.querySelector("#login-form");
  loginForm.onsubmit = login

  const form = document.querySelector(".mood-form");
  form.onsubmit = submit;
}