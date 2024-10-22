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


      if(response.ok){
        window.location.href = '/bookmarks';
      }
  
      if (!response.ok) {
        throw new Error('Login failed');
      }
  
    } catch (error) {
      console.error('Error:', error);
      // Handle the error
    }
  });