window.onload = async function () {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const loginButton = document.getElementById("login-button");
  const createAccountButton = document.getElementById("create-account");
  const submitButton = document.getElementById("submit");
  const loginForm = document.getElementById("login");

  // handle login event
  loginButton.onclick = async function (e) {
    e.preventDefault();

    // input validation
    if (!usernameInput.value || !passwordInput.value) {
      alert("Please enter a username and password");
      return;
    }

    // send the login request
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameInput.value,
        password: passwordInput.value,
      }),
    });

    // if the login was successful, fetch the students and stats
    let res = await response.json();
    const userId = res.userId;
    if (res.success) {
      
      // hide the login form
      loginForm.style.display = "none";

      // dynamically import the functions from student.js
      const handleAdd = await import("./student.js").then(
        (module) => module.handleAdd
      );
      const addStudentToTable = await import("./student.js").then(
        (module) => module.addStudentToTable
      );
      const updateClassStats = await import("./student.js").then(
        (module) => module.updateClassStats
      );

      // this seems kind of stupid but I don't know how else to pass the userId to handleAdd
      function handleAddWrapper(event) {
        handleAdd(event, userId);
      }

      submitButton.onclick = handleAddWrapper;

      const response = await fetch(`/students/${userId}`, {
        method: "GET",
      });

      // populate the table with the existing students (if any)
      const res2 = await response.json();
      if (res2.students) {
        res2.students.forEach((student) => addStudentToTable(student));
      }
      updateClassStats(res2.stats);
    }
    alert(res.message);
  };

  // handle create account event
  createAccountButton.onclick = async function (e) {
    e.preventDefault();

    // input validation
    if (!usernameInput.value || !passwordInput.value) {
      alert("Please enter a username and password");
      return;
    }

    // send the create account request
    const response = await fetch("/create-account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameInput.value,
        password: passwordInput.value,
      }),
    });

    const res = await response.json();
    alert(res.message);
  };
};
