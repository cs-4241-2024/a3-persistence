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
    <p><strong>Last Episode Watched:</strong> ${entry['last ep watched']}</p>
    <p><strong>Progress:</strong> ${entry['last ep watched']}/${apiData.data[0].episodes}</p>
    <p><strong>Date Logged:</strong> ${entry['date logged']}</p>
    <button class="delete-button">Delete</button>
    `;

    card.dataset.username = entry.username;

    const deleteButton = card.querySelector('.delete-button');
    deleteButton.addEventListener('click', deleteCard);

    cardContainer.appendChild(card); 
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

const fetchAppData = async function() {

  try {
    const response = await fetch('/appdata');

    if (response.ok) {
      const data = await response.json();
      displayCards(data);
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
    } else {
      console.error('Register button not found!');
    }
  }
  
  
    const submitButton = document.querySelector("#submitButton");
    if (submitButton) {
      submitButton.onclick = submit;
    } else {
      console.error('Submit button not found!');
    }
  

  if (window.location.pathname.includes('login')) {
    const loginButton = document.querySelector("#login");
    if (loginButton) {
      loginButton.onclick = login;
    } else {
      console.error('Login button not found!');
    }
  }

 
    const logoutButton = document.querySelector("#logoutButton");
    if (logoutButton) {
      logoutButton.onclick = logout;
    } else {
      console.error('logout button not found!');
    }
  
 

  fetchAppData();
}

