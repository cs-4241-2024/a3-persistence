// registration.js
document.getElementById("registerForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("regUsername").value;
    const password = document.getElementById("regPassword").value;

    try {
        const response = await fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            alert("Registration successful! You can now log in.");
            window.location.href = "/login";
        } else {
            alert("Registration failed. Please try again.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while trying to register. Please try again.");
    }
});
