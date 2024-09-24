document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('authForm');
    const toggleLink = document.getElementById('toggle-link');
    const formTitle = document.getElementById('form-title');
    const submitBtn = document.getElementById('submitBtn');
    const messageDiv = document.getElementById('message');

    let isLogin = true;
    toggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        isLogin = !isLogin;
        if (isLogin) {
            formTitle.textContent = 'Login';
            submitBtn.textContent = 'Login';
            toggleLink.textContent = 'Sign up';
        } else {
            formTitle.textContent = 'Sign Up';
            submitBtn.textContent = 'Sign Up';
            toggleLink.textContent = 'Login';
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const endpoint = isLogin ? '/login' : '/signup';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                messageDiv.style.color = 'green';
                messageDiv.textContent = data.message;

                if (data.token) {
                    localStorage.setItem('token', data.token);
                    window.location.href = '/';
                }
            } else {
                messageDiv.style.color = 'red';
                messageDiv.textContent = data.error || 'An error occurred';
            }
        } catch (error) {
            messageDiv.style.color = 'red';
            messageDiv.textContent = 'An error occurred';
        }
    });

    const loadVehicles = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            messageDiv.textContent = 'No token found, please log in.';
            return;
        }

        try {
            const response = await fetch('/vehicles', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Vehicles:', data);
            } else {
                messageDiv.style.color = 'red';
                messageDiv.textContent = data.error || 'An error occurred';
            }
        } catch (error) {
            messageDiv.style.color = 'red';
            messageDiv.textContent = 'An error occurred while fetching vehicles';
        }
    };

    if (window.location.pathname === '/') {
        loadVehicles();
    }
});
