// login.js
document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            window.location.href = "/dashboard";
        } else {
            alert("Login failed. Please check your username and password.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while trying to log in. Please try again.");
    }
});
