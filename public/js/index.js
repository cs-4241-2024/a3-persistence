const login = async function (event) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const json = { username: username, password: password };
  const body = JSON.stringify(json);

  const response = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  if (response.ok) {
    // Redirect to the main page
    window.location.href = "/main.html";
  }
};

window.onload = function () {
  const buttonVariable = document.getElementById("login");
  buttonVariable.onclick = login;
};
