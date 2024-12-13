document.getElementById('login').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    const loginData = { username, password };
  
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });


      if (response.ok) {
        // Unpack the response JSON to extract the message, isNewUser, and redirectTo
        const { message, isNewUser, redirectTo } = await response.json();

        // Handle based on the unpacked values
        console.log(message); // You can display the message or use it as needed

        if (isNewUser){
          alert("New user saved!");
        }

        if (redirectTo) {
            // Redirect to the bookmarks page (or other page based on server response)
            window.location.href = redirectTo;
        } else {
            throw new Error('No redirect URL provided');
        }
    } else {
        // Handle error responses, where you can still get the message
        const errorData = await response.json();
        console.error('Error:', errorData.message || 'Login failed');
        alert('Login failed: ' + errorData.message);
    }
  
    } catch (error) {
      console.error('Error:', error);
      // Handle the error
    }
  });