document.addEventListener("DOMContentLoaded", () => {
    const counter = document.getElementById("counter");
    const timerDisplay = document.getElementById("timer");
    const message = document.getElementById("message");
    const leaderboardDisplay = document.getElementById("leaderboard");
    const playAgainButton = document.getElementById("playAgain");
    const startGameButton = document.getElementById("startGameButton");
    const addEntryForm = document.getElementById("addEntryForm");
  
    let count = 0;
    let timeLeft = 5;
    let timer;
    let isGameActive = false;
    let gameStarted = false;
  
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
  
      const playerName = prompt("Enter your name:");
      if (playerName) {
        submitScore(playerName, count);
      }
  
      playAgainButton.style.display = "block";
      document.removeEventListener("click", handleClick);
      timerDisplay.classList.remove("red");
    };
  
    const submitScore = (name, score) => {
      fetch("/leaderboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          score: score,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          renderLeaderboard(data);
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
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
  
        const nameCell = document.createElement("td");
        nameCell.textContent = entry.name;
        row.appendChild(nameCell);
  
        const scoreCell = document.createElement("td");
        scoreCell.textContent = entry.score;
        row.appendChild(scoreCell);
  
        const dateCell = document.createElement("td");
        dateCell.textContent = entry.date;
        row.appendChild(dateCell);
  
        const actionsCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
          deleteEntry(entry.name, entry.score, entry.date);
        });
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);
  
        leaderboardDisplay.appendChild(row);
      });
    };
  
    const deleteEntry = (name, score, date) => {
      fetch("/leaderboard", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, score, date }),
      })
        .then((response) => response.json())
        .then((data) => {
          renderLeaderboard(data);
        });
    };
  
    addEntryForm.addEventListener("submit", (event) => {
      event.preventDefault();
  
      const name = document.getElementById("name").value;
      const score = document.getElementById("score").value;
  
      if (name && score) {
        submitScore(name, parseInt(score));
      }
    });
  
    fetchLeaderboard();
  
    playAgainButton.addEventListener("click", () => {
      timerDisplay.textContent = 'Click "Start Game" to begin';
      startGameButton.style.display = "block";
      playAgainButton.style.display = "none";
    });
  });