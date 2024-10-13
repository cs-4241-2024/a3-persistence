window.onload = function() {
    const loginForm = document.querySelector('#loginForm');
  
    if (loginForm) {
      loginForm.onsubmit = async function (event) {
        event.preventDefault();
  
        const username = document.querySelector('#username').value;
        const password = document.querySelector('#password').value;
  
        const response = await fetch('/login', {
          method: 'POST',
          body: JSON.stringify({ username, password }),
          headers: { 'Content-Type': 'application/json' }
        });
  
        const result = await response.json();
        if (result.user) {
          window.location.href = '/app';
        } else {
          alert(result.message);
        }
      };
    } else {
      console.error('Login form not found.');
    }
  };
  