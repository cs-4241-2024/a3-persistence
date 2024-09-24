// FRONT-END (CLIENT) JAVASCRIPT HERE

const register = async function (event) {
  
  event.preventDefault();

  const firstNameInput = document.querySelector('#newFirstName').value;
  const lastNameInput = document.querySelector('#newLastName').value;
  const newUsernameInput = document.querySelector('#newUserName').value;
  const newPasswordInput = document.querySelector('#newPassword').value;

  const userData = {
    firstName: firstNameInput,
    lastName: lastNameInput,
    username: newUsernameInput,
    password: newPasswordInput
  };

  const body = JSON.stringify(userData);

  const response = await fetch( '/register', {
    method:'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body
  });

  if (response.ok) {
    const data = await response.json();
    console.log(data.message);
    window.location.href = '/';
  } else {
    const errorData = await response.json();
    console.error(errorData.message);
  }

};

const login = async function(event) {
  
  event.preventDefault();

  const usernameInput = document.querySelector("#existingUsername").value; 
  const passwordInput = document.querySelector("#existingPassword").value;

  const userData = {
    existingUsername: usernameInput,
    existingPassword: passwordInput
  };

  const body = JSON.stringify(userData);

  const response = await fetch( '/login', {
    method:'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body
  });

  if (response.ok) {
    const data = await response.json();
    console.log(data.message);
    window.location.href = '/';
  } else {
    const errorData = await response.json();
    console.error(errorData.message);
  }

};

const logout = async function() {
  
  console.log("logout function reached");
  const response = await fetch('/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    console.log('User logged out');
    window.location.href = '/login';
  } else {
    console.error('Failed to log out.');
  }
};
 
const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault();
  console.log("submit accessed");
  
  const titleInput = document.querySelector('#showTitle').value;
  const episodeInput = document.querySelector('#lastWatched').value;

  const input = {
    showName: titleInput,
    lastViewed: episodeInput
  };

  const body = JSON.stringify(input);

  const response = await fetch( '/submit', {
    method:'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body 
  });

  if (response.ok) {
    const data = await response.json();
    console.log(data);
    fetchAppData();
  } else {
    const errorData = await response.json();
    console.error('Failed to submit data:', errorData);
  }
};

const displayCards = function(data) {

  const cardContainer = document.querySelector("#cardContainer");
  cardContainer.innerHTML = '';

  data.forEach(async entry => {
    const card = document.createElement('div');
    card.classList.add('card');  
    
    let apiData = '';

    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime?q=${entry['show title']}`);
      apiData = await res.json();
      console.log(apiData);
    } catch (err) {
      console.log(err);
    }

    card.innerHTML = `
    <img src="${apiData.data[0].images.jpg.large_image_url}" id="coverImage" alt="animeCoverImage">
    <p><strong>Show Title:</strong> ${entry['show title']}</p>
      <p><strong>Last Episode Watched:</strong> 
        <span id="ep-watched-${entry['_id']}">${entry['last ep watched']}</span>
        <input type="number" id="edit-ep-${entry['_id']}" style="display:none" value="${entry['last ep watched']}">
      </p>
      <p><strong>Progress:</strong> ${entry['last ep watched']}/${apiData.data[0].episodes}</p>
      <p><strong>Date Logged:</strong> ${entry['date logged']}</p>
      <button class="edit-button" data-id="${entry['_id']}">Edit</button>
      <button class="submit-button" data-id="${entry['_id']}" style="display:none">Submit</button>
      <button class="delete-button" data-id="${entry['_id']}">Delete</button>
    `;

    card.dataset.username = entry.username;

    cardContainer.appendChild(card); 

    // Event listeners for edit and delete buttons
    const deleteButton = card.querySelector('.delete-button');
    deleteButton.addEventListener('click', deleteCard);

    const editButton = card.querySelector('.edit-button');
    editButton.addEventListener('click', () => toggleEditMode(entry['_id']));

    const submitButton = card.querySelector('.submit-button');
    submitButton.addEventListener('click', () => submitEdit(entry['_id']));    
  });

};

const deleteCard = async function(event) {
  const button = event.target;
  const card = button.closest('.card');
  const username = card.dataset.username;
  const showTitle = card.querySelector('p').textContent.split(': ')[1];

  const response = await fetch('/delete', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, showTitle })
  });

  if (response.ok) {
    const data = await response.json();
    fetchAppData();
  } else {
    console.error('Failed to delete data');
  }
};

const toggleEditMode = (cardId) => {
  const episodeSpan = document.querySelector(`#ep-watched-${cardId}`);
  const episodeInput = document.querySelector(`#edit-ep-${cardId}`);
  const editButton = document.querySelector(`.edit-button[data-id='${cardId}']`);
  const submitButton = document.querySelector(`.submit-button[data-id='${cardId}']`);

  // Toggle visibility between span and input
  if (episodeSpan.style.display === 'none') {
    episodeSpan.style.display = 'inline';
    episodeInput.style.display = 'none';
    editButton.style.display = 'inline';
    submitButton.style.display = 'none';
  } else {
    episodeSpan.style.display = 'none';
    episodeInput.style.display = 'inline';
    editButton.style.display = 'none';
    submitButton.style.display = 'inline';
  }
};

const submitEdit = async (cardId) => {
  const newEpisode = document.querySelector(`#edit-ep-${cardId}`).value;

  const response = await fetch(`/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cardId,
      lastWatched: Number(newEpisode)
    })
  });

  if (response.ok) {
    // Refresh the card data after successful update
    fetchAppData();
  } else {
    console.error('Failed to update data');
  }
};


const fetchAppData = async function() {

  try {
    const response = await fetch('/appdata');

    if (response.ok) {
      const data = await response.json();
      displayCards(data);
    } else if (response.status === 401) {
      if (window.location.pathname !== '/login') {
        console.error('User not logged in. Redirecting to login...');
        window.location.href = '/login';
      }
    } else {
      const errorData = await response.json();
      console.error('Failed to fetch app data:', errorData);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

window.onload = function() {

  if (window.location.pathname.includes('register')) {
    const registerButton = document.querySelector('#register');
    if (registerButton) {
      registerButton.onclick = register;
    } 
  }
  
    const submitButton = document.querySelector("#submitButton");
    if (submitButton) {
      submitButton.onclick = submit;
    } 
  

  if (window.location.pathname.includes('login')) {
    const loginButton = document.querySelector("#login");
    if (loginButton) {
      loginButton.onclick = login;
    } 
  }

 
    const logoutButton = document.querySelector("#logoutButton");
    if (logoutButton) {
      logoutButton.onclick = logout;
    } 
  
 
  if (!window.location.pathname.includes('login') && !window.location.pathname.includes('register')) {
    fetchAppData();
  }
}

