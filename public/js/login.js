document.getElementById('loginForm').onsubmit = async function (e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    const response = await fetch('/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, password})
    });
  
    const result = await response.json();
    if (response.ok) {
      window.location.href = '/'; 
    } else {
      alert(result.message);
    }
  };
  
document.getElementById('signupForm').onsubmit = async function (e) {
    e.preventDefault();
  
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
  
    const response = await fetch('/register', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, password})
    });
  
    const result = await response.json();
    if (response.ok) {
      alert('User registered successfully');
    } else {
      alert(result.message);
    }
  };