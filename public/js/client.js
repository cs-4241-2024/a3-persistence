document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login");
    loginForm.onsubmit = async function (event) {
      event.preventDefault();

      const username = document.getElementById("login_username").value;
      const password = document.getElementById("login_password").value;

      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        window.location.href = "/index.html";
      } else {
        console.error("Login failed");
        alert("Login failed. Incorrect credentials.");
      }
    };

    const signupForm = document.getElementById("signup");
    signupForm.onsubmit = async function (event) {
      event.preventDefault();

      const username = document.getElementById("signup_username").value;
      const password = document.getElementById("signup_password").value;

      const response = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        alert("Registration successful. You can now log in.");
      } else {
        console.error("Registration failed");
        alert("Registration failed; please try again.");
      }
    };
  });
