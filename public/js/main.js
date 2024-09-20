document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");
  const logoutButton = document.getElementById("logoutButton");
  const gameUI = document.getElementById("gameUI");
  const leaderboardDisplay = document.getElementById("leaderboard");
  const counter = document.getElementById("counter");
  const timerDisplay = document.getElementById("timer");
  const message = document.getElementById("message");
  const playAgainButton = document.getElementById("playAgain");
  const startGameButton = document.getElementById("startGameButton");

  let count = 0;
  let timeLeft = 5;
  let timer;
  let isGameActive = false;
  let gameStarted = false;
  let loggedInUsername = "";

  // Handle registration
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;

    fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        if (!data.error) {
          loggedInUsername = username;
          showGameUI();
        }
      });
  });

  // Handle login
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        if (!data.error) {
          loggedInUsername = username;
          showGameUI();
        }
      });
  });

  // Handle logout
  logoutButton.addEventListener("click", () => {
    fetch("/logout", { method: "POST" })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        hideGameUI();
      });
  });

  // Show game UI when logged in
  function showGameUI() {
    gameUI.style.display = "block";
    loginForm.style.display = "none";
    registerForm.style.display = "none";
    logoutButton.style.display = "block";
    fetchLeaderboard();
  }

  // Hide game UI on logout
  function hideGameUI() {
    gameUI.style.display = "none";
    loginForm.style.display = "block";
    registerForm.style.display = "block";
    logoutButton.style.display = "none";
  }

  // Game logic
  startGameButton.addEventListener("click", () => {
    startGameButton.style.display = "none";
    startGame();
  });

  const startGame = () => {
    count = 0;
    timeLeft = 5;
    isGameActive = true;
    gameStarted = true;
    counter.textContent = `Clicks: ${count}`;
    timerDisplay.textContent = `Time Left: ${timeLeft}`;
    message.textContent = "";
    playAgainButton.style.display = "none";
    document.addEventListener("click", handleClick);
    timer = setInterval(updateTimer, 1000);
  };

  const handleClick = () => {
    if (isGameActive) {
      count++;
      counter.textContent = `Clicks: ${count}`;
      counter.classList.add("pulsate");
      setTimeout(() => {
        counter.classList.remove("pulsate");
      }, 500);
    }
  };

  const updateTimer = () => {
    timeLeft--;
    timerDisplay.textContent = `Time Left: ${timeLeft}`;

    if (timeLeft <= 5) {
      timerDisplay.classList.add("red");
    }

    if (timeLeft <= 0) {
      endGame();
    }
  };

  const endGame = () => {
    clearInterval(timer);
    isGameActive = false;
    gameStarted = false;
    message.textContent = `Time's up! You clicked ${count} times.`;

    submitScore(count);

    playAgainButton.style.display = "block";
    document.removeEventListener("click", handleClick);
    timerDisplay.classList.remove("red");
  };

  const submitScore = (score) => {
    fetch("/leaderboard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ score }),
    })
      .then((response) => response.json())
      .then((data) => {
        renderLeaderboard(data);
      })
      .catch((error) => {
        console.error("Error submitting score:", error);
      });
  };

  const fetchLeaderboard = () => {
    fetch("/leaderboard")
      .then((response) => response.json())
      .then((data) => {
        renderLeaderboard(data);
      })
      .catch((error) => {
        console.error("Error fetching leaderboard:", error);
      });
  };

  const renderLeaderboard = (data) => {
    leaderboardDisplay.innerHTML = ""; 

    data.sort((a, b) => b.score - a.score);

    data.forEach((entry, index) => {
      const row = document.createElement("tr");

      const rankCell = document.createElement("td");
      rankCell.textContent = `#${index + 1}`;
      row.appendChild(rankCell);

      const usernameCell = document.createElement("td");
      usernameCell.textContent = entry.username;
      row.appendChild(usernameCell);

      const scoreCell = document.createElement("td");
      scoreCell.textContent = entry.score;
      row.appendChild(scoreCell);

      const dateCell = document.createElement("td");
      dateCell.textContent = entry.date;
      row.appendChild(dateCell);

      const actionsCell = document.createElement("td");

      if (entry.username === loggedInUsername) {
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
          deleteEntry(entry.username, entry.score, entry.date);
        });
        actionsCell.appendChild(deleteButton);
      }

      row.appendChild(actionsCell);
      leaderboardDisplay.appendChild(row);
    });
  };

  const deleteEntry = (username, score, date) => {
    fetch("/leaderboard", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, score, date }),
    })
      .then((response) => response.json())
      .then((data) => {
        renderLeaderboard(data);
      })
      .catch((error) => {
        console.error("Error deleting entry:", error);
      });
  };

  playAgainButton.addEventListener("click", () => {
    timerDisplay.textContent = 'Click "Start Game" to begin';
    startGameButton.style.display = "block";
    playAgainButton.style.display = "none";
  });
});
