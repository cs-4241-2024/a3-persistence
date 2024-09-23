// import "nes.css/css/nes.min.css";

// Set up stage
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

const statusText = document.getElementById("statusText");

const size = 600;
canvas.width = size;
canvas.height = size;
canvas.style = `width: ${size}px; height: ${size}px;`;

// Get images
const racetrack = document.getElementById("racetrack");
const racecar = document.getElementById("racecar");

// Store racecar values
let velocity = 0,
  x = size / 3,
  y = size / 18,
  direction = 0;
const carWidth = size / 8;
const carLenght = size / 16;

const draw = () => {
  // Draw grass
  ctx.fillStyle = "#2ab50b";
  ctx.fillRect(0, 0, size, size);

  // Draw track
  ctx.drawImage(racetrack, 0, 0, size, size);

  // Get racecar position pixel
  const pixelData = ctx.getImageData(
    x + carWidth / 2,
    y + carLenght / 2,
    1,
    1
  ).data;

  // Draw racecar
  ctx.translate(x + carWidth / 2, y + carLenght / 2);
  ctx.rotate(direction);
  ctx.drawImage(racecar, -carWidth / 2, -carLenght / 2, carWidth, carLenght);
  ctx.resetTransform();

  // Draw timer
  ctx.fillStyle = "Black";
  ctx.font = "25px serif";
  let time =
    startTime == 0 ? 0 : Math.floor((Date.now() - startTime) / 100) / 10;
  ctx.fillText(time + (time % 1 == 0 ? ".0" : ""), 10, 30);

  return pixelData[0] == 42;
};

// Store inputs
let forward = false,
  backward = false,
  right = false,
  left = false;

// Timer
let startTime = 0;
let prevLap = 0;

// Add input listeners
document.addEventListener("keydown", (e) => {
  // Check if race is not started, if not, start race
  if (startTime == 0) {
    startTime = Date.now();
    prevLap = startTime;
    requestAnimationFrame(run);
  }

  switch (e.key) {
    case "ArrowUp":
    case "w":
      forward = true;
      break;
    case "ArrowDown":
    case "s":
      backward = true;
      break;
    case "ArrowRight":
    case "d":
      right = true;
      break;
    case "ArrowLeft":
    case "a":
      left = true;
      break;
  }
});

document.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "ArrowUp":
    case "w":
      forward = false;
      break;
    case "ArrowDown":
    case "s":
      backward = false;
      break;
    case "ArrowRight":
    case "d":
      right = false;
      break;
    case "ArrowLeft":
    case "a":
      left = false;
      break;
  }
});

// Lap controls
let lapTimes = [1, 2];
let checkpoint = false;

// Game running function
const run = async () => {
  // If start time is 0, the stage was reset
  if (startTime == 0) return;

  // Check for crossing checkpoint and lap
  if (!checkpoint && y > (size * 3) / 4) {
    statusText.innerHTML = "Checkpoint Reached!";
    checkpoint = true;
  } else if (checkpoint && y < size / 8 && x > size / 3) {
    checkpoint = false;
    const lapTime = Date.now();
    const delta = (lapTime - prevLap) / 1000;
    lapTimes.push(delta);
    statusText.innerHTML = "Lap " + lapTimes.length + " time: " + delta;
    prevLap = lapTime;
  }

  if (right && !left) {
    direction += 0.02;
  } else if (left && !right) {
    direction -= 0.02;
  }

  if (forward && !backward) {
    velocity += 0.02;
  } else if (backward && !forward) {
    velocity -= 0.02;
  }

  x += velocity * Math.cos(direction);
  y += velocity * Math.sin(direction);

  // Draw stage
  const onGrass = draw();

  // If on grass, slow down
  if (onGrass) {
    if (velocity > 1) {
      velocity -= 0.5;
    } else if (velocity < -1) {
      velocity += 0.5;
    }
  }

  if (lapTimes.length < 3) requestAnimationFrame(run);
  else {
    // Submit time
    await fetch("/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lapTimes }),
    });

    // Update table
    setupTable();
  }
};

const setupTable = async () => {
  const response = await fetch("/highscores", {
    method: "GET",
  });

  const text = await response.text();
  const data = JSON.parse(text);

  const table = document.getElementById("highscores");

  // Reset table
  table.innerHTML = `<tr>
          <th>Lap 1</th>
          <th>Lap 2</th>
          <th>Lap 3</th>
          <th>Total</th>
          <th>Options</th>
        </tr>`;

  for (let i = 0; i < data.length; i++) {
    const tableRow = table.insertRow();
    for (let k = 0; k < 4; k++) {
      const tableCell = tableRow.insertCell(k);

      // Round value
      data[i].lapTimes[k] = Math.floor(data[i].lapTimes[k] * 10) / 10;

      tableCell.innerHTML = data[i].lapTimes[k];
    }
    const buttonCell = tableRow.insertCell(4);

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.classList.add("nes-button");
    deleteButton.classList.add("is-error");
    deleteButton.onclick = async () => {
      await fetch("/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: data[i]._id }),
      });

      setupTable();
    };
    buttonCell.appendChild(deleteButton);

    const editButton = document.createElement("button");
    editButton.innerHTML = "Edit";
    editButton.className = "nes-button";
    editButton.onclick = async () => {
      document.getElementById("popup").style.display = "inline";

      document.getElementById("lap1input").value = data[i].lapTimes[0];
      document.getElementById("lap2input").value = data[i].lapTimes[1];
      document.getElementById("lap3input").value = data[i].lapTimes[2];

      document.getElementById("idHolder").value = data[i]._id;
    };
    buttonCell.appendChild(editButton);
  }
};

const resetStage = () => {
  // Reset status text
  statusText.innerHTML =
    "Use WASD or arrow keys to reach the checkpoint at the bottom of the map.";

  // Reset racecar values
  velocity = 0;
  x = size / 3;
  y = size / 18;
  direction = 0;

  // Reset lap and checkpoint
  lapTimes = [];
  checkpoint = false;

  // Timer
  startTime = 0;
  prevLap = 0;

  // Redraw
  draw();
};

// Draw initial scene upon image load
racecar.onload = () => {
  draw();
};
racetrack.onload = () => {
  draw();
};

draw();

// Set up base table
setupTable();

document.getElementById("reset").onclick = resetStage;
document.getElementById("logout").onclick = async () => {
  await fetch("/logout", {
    method: "GET",
  });
  document.location.href = "/";
};
