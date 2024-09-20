let clicks = 0;
let gameStarted = false;
window.onload = function () {
 showLogin();
 document.getElementById('register-form').onsubmit = async function (event) {
   event.preventDefault();
   const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();
   if (!username || !password) {
       alert('Please enter username and password.');
     return;
   }
   try {
     const response = await fetch('/register', {
       method: 'POST',
         headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ username, password }),
       credentials: 'include',
     });
     const result = await response.json();
     if (response.ok) {
       alert(result.message);
       showLogin();
     } else {
       alert(result.error);
     }
   } catch (error) {
     console.error('Error during registration:', error);
     alert('An error occurred during registration.');
   }
 };


 document.getElementById('login-form').onsubmit = async function (event) {
   event.preventDefault();
   const username = document.getElementById('login-username').value.trim();
   const password = document.getElementById('login-password').value.trim();
   if (!username || !password) {
     alert('Please enter both username and password.');
     return;
   }
   try {
     const response = await fetch('/login', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ username, password }),
       credentials: 'include',
     });
     const result = await response.json();
     if (response.ok) {
       showDashboard(result.username);
     } else {
       console.error('Login failed:', result.error);
       alert(result.error);
     }
   } catch (error) {
     console.error('Error during login:', error);
     alert('An error occurred during login.');
   }
 };


   document.getElementById('logout-button').onclick = async function () {
   try {
       const response = await fetch('/logout', {
          method: 'POST',
       credentials: 'include',
     });
     const result = await response.json();
     if (response.ok) {
       alert(result.message);
       showLogin();
     } else {
       alert('Logout failed');
     }
   } catch (error) {
     console.error('Error during logout:', error);
     alert('An error occurred during logout.');
   }
 };


 document.getElementById('start-game').onclick = function () {
   clicks = 0;
   gameStarted = true;
   document.getElementById('click-button').disabled = false;
   document.getElementById('click-count').textContent = clicks;
   setTimeout(function () {
     gameStarted = false;
     document.getElementById('click-button').disabled = true;
     alert('Game is Over!');
     submitScore();
   }, 5000);
 };
 document.getElementById('click-button').onclick = function () {
   if (gameStarted) {
     clicks++;
     document.getElementById('click-count').textContent = clicks;
   }
 };
};

async function submitScore() {
 try {
   const response = await fetch('/submit', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ clicks }),
     credentials: 'include',
   });
   const result = await response.json();
   if (response.ok) {
     fetchHighScores();
   } else {
     alert(result.error);
   }
 } catch (error) {
   console.error('Error submitting score:', error);
   alert('An error occurred while submitting your score.');
 }
}
async function fetchHighScores() {
 try {
   const response = await fetch('/highscores', {
     credentials: 'include',
   });
   const scores = await response.json();
   if (response.ok) {
     const list = document.getElementById('high-scores-list');
     list.innerHTML = '';
     scores.forEach((score) => {
       const item = document.createElement('li');
       item.className = 'list-group-item d-flex justify-content-between align-items-center';
       item.innerHTML = `
         Clicks: ${score.clicks}, Date: ${score.date}
         <span>
           <button class="btn btn-sm btn-primary edit-button">Edit</button>
           <button class="btn btn-sm btn-danger delete-button">Delete</button>
         </span>
       `;
       item.querySelector('.edit-button').onclick = () => editScore(score);
       item.querySelector('.delete-button').onclick = () => deleteScore(score._id);
       list.appendChild(item);
     });
   } else {
     alert(scores.error);
   }
 } catch (error) {
   console.error('Error fetching high scores:', error);
   alert('An error occurred while fetching high scores.');
 }
}
function editScore(score) {
 const newClicks = prompt('Enter new clicks value:', score.clicks);
 if (newClicks !== null) {
   updateScore(score._id, parseInt(newClicks, 10));
 }
}
async function updateScore(id, clicks) {
 if (isNaN(clicks) || clicks < 0) {
      alert('Please enter a valid number of clicks.');
   return;
 }
 try {
   const response = await fetch(`/scores/${id}`, {
     method: 'PUT',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ clicks }),
     credentials: 'include',
   });
   const result = await response.json();
      if (response.ok) {
     fetchHighScores();
   } else {
     alert(result.error);
   }
 } catch (error) {
   console.error('Error updating score:', error);
      alert('An error occurred while updating the score.');
 }
}
async function deleteScore(id) {
 if (!confirm('Are you sure you want to delete this score?')) {
   return;
 }
 try {
   const response = await fetch(`/scores/${id}`, {
        method: 'DELETE',
     credentials: 'include',
   });
   const result = await response.json();
   if (response.ok) {
     fetchHighScores();
   } else {
     alert(result.error);
   }
 } catch (error) {
   console.error('Error deleting score:', error);
      alert('An error occurred while deleting the score.');
 }
}
function showLogin() {
 document.getElementById('register-section').style.display= 'none';
 document.getElementById('login-section').style.display ='block';
 document.getElementById('dashboard-section').style.display = 'none';
 document.getElementById('login-form').reset();
}
function showRegister() {
  document.getElementById('register-section').style.display= 'block';
 document.getElementById('login-section').style.display = 'none';
  document.getElementById('dashboard-section').style.display ='none';
 document.getElementById('register-form').reset();
}
function showDashboard(username) {
 document.getElementById('register-section').style.display = 'none';
 document.getElementById('login-section').style.display = 'none';
 document.getElementById('dashboard-section').style.display = 'block';
   document.getElementById('user-name').textContent = username;
 document.getElementById('click-count').textContent = '0';
 document.getElementById('click-button').disabled = true;
 fetchHighScores();
}
