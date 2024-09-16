// Wait for the DOM to load before attaching event listeners
document.addEventListener('DOMContentLoaded', function () {

    // Select the login form
    const loginForm = document.querySelector('#login-form');
    const registerButton = document.querySelector('#register-btn');

    // Attach an event listener to handle login form submission
    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Get the form data (username and password)
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        console.log('Username:', username); // Debug log
        console.log('Password:', password); // Debug log

        try {
            // Send a POST request to the /login route
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password }) // Send the username and password in JSON format
            });

            // Parse the response
            const data = await response.json();
            console.log('Response:', data); // Debug log

            if (response.ok) {
                // Redirect to the restaurant app at index.html
                window.location.href = 'index.html';
            } else {
                // If login fails, check if it's due to an invalid username
                alert(data.message);
                if (data.message === 'Invalid username or password') {
                    const register = confirm('User does not exist. Would you like to create an account?');
                    if (register) {
                        registerUser(username, password); // Call the registration function
                    }
                } else {
                    alert(data.message);
                }
            }

        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred during login. Please try again.');
        }
    });

    // Attach an event listener to handle the registration button
    registerButton.addEventListener('click', function () {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username && password) {
            registerUser(username, password);
        } else {
            alert('Please fill in both username and password to register.');
        }
    });

    // Function to register a new user
    async function registerUser(username, password) {
        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password }) // Send the username and password in JSON format
            });

            const data = await response.json();
            console.log('Register Response:', data); // Debug log

            if (response.ok) {
                alert('Registration successful. You can now log in.');
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.error('Error during registration:', error);
            alert('An error occurred during registration. Please try again.');
        }
    }
});
