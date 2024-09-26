/**
 * Attempts to log in user with given username and password.
 * @param {*} event 
 */
async function login(event)
{
  // Prevent browser from loading a new page
  event.preventDefault();

  // Get data from form
  const login_user = document.querySelector("#login-user");
  const login_pass = document.querySelector("#login-pass");

  // Convert data to JSON
  const json = {user: login_user.value, pass: login_pass.value};
  const body = JSON.stringify(json);
  
  // Send POST request
  const response = await fetch("/login", {method:"POST", headers: {"Content-Type": "application/json"}, body});
  const text     = await response.text();

  if (response.ok)
  {
    document.querySelector("#login-msg").innerText = `Login success!`;

    document.open();
    document.write(text);
    document.close();
  }
  else
  {
    document.querySelector("#login-msg").innerText = `Login failed!`;

    // Alert window if error
    // window.alert(`ERROR: ${text}`);
  }
}

/**
 * Set button click action to submit function.
 */
window.onload = function()
{
  // Set submit function
  const loginBtn = document.getElementById("login-btn");
  loginBtn.onclick = login;

  // console.log("LOADED LOGIN.JS");
}
