const submit = async function (event) {
    event.preventDefault();
    
    const opponent = document.querySelector("#opponent");
    const gameDate = document.querySelector("#game-date");
    const gameTime = document.querySelector("#game-time");
    const location = document.querySelector("#location");
  
    if (opponent.value === '') {
      window.alert("Please enter opponent team");
      return;
    }
    if (gameDate.value === '') {
      window.alert("Please enter game date");
      return;
    }
  
    const json = {
      opponent: opponent.value,
      gameDate: gameDate.value,
      gameTime: gameTime.value,
      location: location.value
    };
  
    const body = JSON.stringify(json);
  
    const response = await fetch('/addGame', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: body
    });
  
    const data = await response.json();
    createTable(data);
  };
  
  const removeGame = async function (gameId) {
    const json = { removeId: gameId };
    const body = JSON.stringify(json);
  
    const response = await fetch("/removeGame", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body
    });
  
    const data = await response.json();
    createTable(data);
  };
  
  const createTable = function (jsonData) {
    const table = document.querySelector("#game-table");
    console.log(table);
    table.innerHTML = "<tr> <th>Opponent</th><th>Game Date</th><th>Game Time</th><th>Location</th><th>Action</th> </tr>";
    
    jsonData.forEach(entry => {
      table.innerHTML += <tr>
        <td>${entry.opponent}</td>
        <td>${new Date(entry.gameDate).toLocaleDateString()}</td>
        <td>${entry.gameTime}</td>
        <td>${entry.location}</td>
        <td><button onclick="removeGame('${entry._id}')">Remove</button></td>
      </tr>;
    });
  };