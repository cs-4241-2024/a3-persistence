(function () {
  let selected;
  let score = 0;
  let isGameStarted = false;
  let startTime, endTime;
  const dropZones = document.querySelectorAll(".drop");
  const startGameBtn = document.querySelector(".play-btn");
  const endGamebtn = document.querySelector(".end-btn");
  const errorMsg = document.querySelector("#error");
  const scoreDisplay = document.querySelector("#score");
  const nameInput = document.querySelector("#name");

  const disableDragAndDrop = () => {
    document.querySelectorAll('.drag-section div').forEach((item) => {
      item.setAttribute('draggable', false);
    });
  };

  const resetGame = () => {
    // Reset the score and the display
    score = 0;
    scoreDisplay.innerText = score;

    // Re-enable dragging and drop zones
    enableDragAndDrop();

    // Re-enable the start and end buttons
    startGameBtn.style.display = "none";
    endGamebtn.style.display = "inline";
    nameInput.value = "";
    checkIfNameExists();

    // Reset shapes by moving them back to the drag section (or re-shuffling)
    shuffle();

    // Allow the game to start again
    isGameStarted = false;
  };

  const enableDragAndDrop = () => {
    document.querySelectorAll('.drag-section div').forEach((item) => {
      item.setAttribute('draggable', true);
    });
  };

  const startGame = () => {
    window.location.reload();
    startTime = new Date();
    sessionStorage.setItem("startTime", startTime.toISOString());
    isGameStarted = true;
    enableDragAndDrop();
  };

  const checkIfNameExists = () => {
    const playerName = nameInput.value.trim();

    if (!playerName) {
      errorMsg.style.opacity = 100;
      errorMsg.style.display = "inline";
      errorMsg.innerText = "Please enter your name";
      return;
    }
    errorMsg.style.display = "none";
  }

  const handleNameInput = (e) => {
    const playerName = nameInput.value.trim();

    if (playerName && !isGameStarted) {
      isGameStarted = true;
      enableDragAndDrop();
      errorMsg.style.display = "none";
    } else if (!playerName) {
      isGameStarted = false;
      disableDragAndDrop();
      errorMsg.style.opacity = 100;
      errorMsg.innerText = "Please enter your name to play";
    }
  }

  const endGame = () => {
    if (nameInput.value.trim() === "") {
      errorMsg.style.opacity = 100;
      errorMsg.style.display = "inline";
      errorMsg.innerText = "Please enter your name";
      return;
    } else {
      errorMsg.style.display = "none";
      startGameBtn.style.display = "inline";
      // addScore(gameTime);
      endGamebtn.style.display = "none";
      isGameStarted = false;
      disableDragAndDrop();
    }
    startTime = new Date(sessionStorage.getItem("startTime")); // Retrieve start time
    endTime = new Date(); // Record end time
    showScore();
    const gameDuration = (endTime - startTime) / 1000; // Calculate duration in seconds
    addScore(gameDuration); // Pass the game duration
    sessionStorage.removeItem("startTime");
    console.error('Error: startTime is not set.');
    //resetGame();
  };

  const addScore = (gameTime) => {
    let num = score;
    document.querySelector('#score').innerText = score; // Update the score display
    let name = document.querySelector("#name").value;

    fetch('/save-score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ score: num, name: name, duration: gameTime })
    }).then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    showScore();
  };

  const shuffle = () => {
    // Shuffles the holes
    $(".drop-section").each(function () {
      var divs = $(this).find('div');
      for (var i = 0; i < divs.length; i++) $(divs[i]).remove();
      //the fisher yates algorithm, from http://stackoverflow.com/questions/2450954/how-to-randomize-a-javascript-array
      var i = divs.length;
      if (i == 0) return false;
      while (--i) {
        var j = Math.floor(Math.random() * (i + 1));
        var tempi = divs[i];
        var tempj = divs[j];
        divs[i] = tempj;
        divs[j] = tempi;
      }
      for (var i = 0; i < divs.length; i++) $(divs[i]).appendTo(this);
    });
  };

  const handleSubmitName = (e) => {
    e.preventDefault();

    let name = document.querySelector("#name").value;
    fetch('/save-name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: name })
    }).then(response => response.json())
      .then(data => {
        console.log('Successfully saved name:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  document.querySelector("#form").addEventListener("submit", handleSubmitName);

  const handleDrop = (e) => {
    if (!isGameStarted) {
      return;
    }

    if (document.querySelector(".drag-section").childElementCount === 1) {
      // Calls end condition if all the shapes are matched 
      endGame();
    }
    if (e.target.classList.contains(selected.className)) {
      // Handles the correct dropped shape: Increment score
      errorMsg.style.opacity = 0; // Hides the error message
      e.target.classList.remove("drop"); // Removes the drop class
      selected.remove(); // Removes the selected shape
      score++;
      document.querySelector('#score').innerText = score; // Updates the score
      return;
    } else if (score === 0) {
      // Condition to not get a negative score
      errorMsg.innerText = "Wrong shape!";
      errorMsg.style.display = "inline";
      errorMsg.style.opacity = 100; // Shows the error message
      return;
    }
    // Handles the wrong dropped shape: Decrement score
    errorMsg.style.opacity = 100;
    errorMsg.style.display = "inline";
    errorMsg.innerText = "Wrong shape!";
    score--;
    document.querySelector('#score').innerText = score;
  };

  const handleDragStart = (e) => {
    if (!isGameStarted) {
      return;
    }
    selected = e.target;
    e.target.style.opacity = 0.5;
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = 1;
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  const showScore = () => {
    fetch('/scores')
      .then(response => response.json())
      .then(data => {
        // Clear the list before adding new scores
        const ul = document.querySelector("ul");
        ul.innerHTML = "";
        console.log('Success:', data);
        const scores = data.scores;


        scores.forEach((entry, index) => {
          $(".List").append(`
            <li class="flex justify-between items-center px-0 py-2.5 border-b-[#ccc] border-[none] border-b border-solid">
              <div class="grow mr-5 border-[none]">
                [Game ${index}] : ${entry.name} - ${entry.score} points in ${entry.time} seconds
              </div>
              <div class="flex gap-2.5 border-[none]">
                <button class="text-[#EEA1A6] border px-2.5 py-[5px] rounded-[5px] border-solid border-[#EEA1A6]" data-id="${entry._id}">&#9998</button>
                <button class="text-[#A30B37] border px-2.5 py-[5px] rounded-[5px] border-solid border-[#A30B37]" data-id="${entry._id}">&#128465</button>
              </div>
            </li>
          `);
        });
        document.querySelectorAll('.edit-btn').forEach(button => {
          button.addEventListener('click', handleEdit);
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
          button.addEventListener('click', handleDelete);
        });

        if (scores.length === 0) {
          $(".List").append(`
          <li class="flex justify-between items-center">
            <div class="grow mr-5 border-[none]">
              No scores yet
            </div>
          </li>
        `);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleEdit = (event) => {
    const id = event.target.dataset.id; // Get the ID of the document to edit
    const newName = prompt("Enter a new name:"); // Prompt user for new name

    if (newName) {
      fetch(`/update-name/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newName })
      })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
          showScore(); // Refresh the scores list
        })
        .catch(error => console.error('Error:', error));
    }
  };

  const handleDelete = (event) => {
    const id = event.target.dataset.id; // Get the ID of the document to delete

    fetch(`/delete-score/${id}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        console.log('Deleted successfully:', data);
        showScore(); // Refresh the scores list
      })
      .catch(error => console.error('Error:', error));
  };

  document.addEventListener('dragstart', (e) => handleDragStart(e));
  document.addEventListener('dragend', (e) => handleDragEnd(e));
  dropZones.forEach((zone) => {
    zone.addEventListener('drop', (e) => handleDrop(e));
    zone.addEventListener("dragover", (e) => allowDrop(e));
  });


  startGameBtn.style.display = "none";
  errorMsg.style.opacity = 0;
  scoreDisplay.innerText = score;

  // Initialize the game
  disableDragAndDrop();
  nameInput.addEventListener("input", handleNameInput);
  $(".play-btn").click(startGame);
  $(".end-btn").click(endGame);

  $("#reset").click(() => {
    //  Clears scoreboard
    console.log("Reset Score");
    fetch('/reset-score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        const ul = document.querySelector("ul");
        ul.innerHTML = "";  // Clear the scores list on the page
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });

  $(document).ready(function (e) {
    // Check if the user is authenticated
    fetch('/auth-check')
      .then(response => response.json())
      .then(data => {
        const authBtn = document.getElementById('auth-btn');
        const profilePic = document.getElementById('profile-pic');
        const profileName = document.getElementById('profile-name');
        const profileEmail = document.getElementById('profile-email');
        if (!data.isAuthenticated) {
          window.location.href = '/login';
        } else {
          authBtn.innerText = 'Logout';
          profileName.innerText = data.user.nickname;
          profileEmail.innerText = data.user.email;
          profilePic.src = data.user.picture;

          authBtn.addEventListener('click', () => {
            window.location.href = '/logout';
          });
        }
      })
      .catch(error => {
        console.error('Error checking authentication status:', error);
      });

    shuffle();
    showScore();
    checkIfNameExists();
  });

})();