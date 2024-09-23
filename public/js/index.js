window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-form').addEventListener('submit', async (evt) => {
        evt.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        let response = await fetch("/login", {
            method: 'POST',
            body: JSON.stringify({
                username: username,
                password: password 
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 403) {
            alert("Incorrect username or password");
        } else {
            response = await response.text();
            if (response === "new") {
                alert("User created");
            }
            window.location.href = "/";
        }
    });
});