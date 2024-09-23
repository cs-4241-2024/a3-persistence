// FRONT-END (CLIENT) JAVASCRIPT HERE

const register = async function (event) {
  console.log("register function triggered");
  event.preventDefault();

  const firstNameInput = document.querySelector('#newFirstName').value;
  const lastNameInput = document.querySelector('#newLastName').value;
  const newUsernameInput = document.querySelector('#newUserName').value;
  const newPasswordInput = document.querySelector('#newPassword').value;

  // Debugging logs to check if the values are correct
/*   console.log("First Name: ", firstNameInput);
  console.log("Last Name: ", lastNameInput);
  console.log("Username: ", newUsernameInput);
  console.log("Password: ", newPasswordInput); */

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

}
 
const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const nameInput = document.querySelector('#yourName').value;
  const titleInput = document.querySelector('#showTitle').value;
  const episodeInput = document.querySelector('#lastWatched').value;

  const input = {
    username: nameInput,
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
    console.error('Failed to submit data');
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
    <h3>${entry.username}</h3>
    <hr class="solidLine"> 
    <img src="${apiData.data[0].images.jpg.large_image_url}" id="coverImage">
    <p><strong>Show Title:</strong> ${entry['show title']}</p>
    <p><strong>Last Episode Watched:</strong> ${entry['last ep watched']}</p>
    <p><strong>Progress:</strong> ${entry['last ep watched']}/${apiData.data[0].episodes}</p>
    <p><strong>Date Logged:</strong> ${entry['date logged']}</p>
    <button class="delete-button">Delete</button>
    `;

    const deleteButton = card.querySelector('.delete-button');
    deleteButton.addEventListener('click', deleteCard);

    cardContainer.appendChild(card); 
  });

};

const deleteCard = async function(event) {
  const button = event.target;
  const card = button.closest('.card');
  const username = card.querySelector('h3').textContent;
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
  const response = await fetch('/appdata');

  if (response.ok) {
    const data = await response.json();
    displayCards(data);
  } else {
    console.error('Failed to fetch app data');
  }
};

window.onload = function() {
  console.log("page loaded");

  if (window.location.pathname.includes('register')) {
    const registerButton = document.querySelector('#register');
    if (registerButton) {
      registerButton.onclick = register;
    } else {
      console.error('Register button not found!');
    }
  }
  
  if (window.location.pathname.includes('submitButton')) {
    const submitButton = document.querySelector("#submitButton");
    if (submitButton) {
      submitButton.onclick = submit;
    } else {
      console.error('Submit button not found!');
    }
  }
 

  fetchAppData();
}

