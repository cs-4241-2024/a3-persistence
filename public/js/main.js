document.getElementById('login-form').addEventListener('submit', function (event) {
  event.preventDefault();
  
  // Get the username and password and store them in variables
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;



  // Send the username and password to the server
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      password: password
    }),
  })
    .then(response => response.json()) // Parse the response as JSON
    .then(data => {
      console.log(data); // Log the response data from the server
      if (data.success) {
        // Redirect to home.html on success
        sessionStorage.setItem('username', username);
        window.location.href = '/home.html';
      } else {
        alert(data.message);
        console.error('Login failed:', data.message);
      }
    })
    .catch(error => console.error('Error:', error));

  // Clear the input fields after submitting
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
  console.log('Form submitted');
});


