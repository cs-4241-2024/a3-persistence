const submit = async function (event) {
  if (isLoggedIn) {
    event.preventDefault();

    const game = document.getElementById("game").value;
    const genre = document.getElementById("genre").value;
    const cost = document.getElementById("cost").value;
    const discount = document.getElementById("discount").value;
    let amountOff = (parseInt(discount) / 100) * parseInt(cost);
    if (isNaN(amountOff) || amountOff === null) {
      amountOff = 0;
    }
    const data = {
      game,
      genre,
      cost,
      discount,
      discountCost: cost - amountOff,
      username,
      password,
    };

    const postResponse = await fetch("/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    getResponse();
  }
};

const updateData = async function (newData) {
  const bodyData = document.getElementById("bodyData");
  let innerHTML = "";
  newData.forEach((game, index) => {
    innerHTML += `<tr>
    <td>${game.game}</td>
    <td>${game.genre}</td>
    <td>$${game.cost}</td>
    <td>${game.discount}%</td>
    <td>$${game.discountCost}</td>
    <td><button class="button" onclick="deleteGame(${game.game})" id="delete">Delete</button></td>
    <td><button class="button" onclick="modifyGame(${game.game})" id="modify">Modify</button></td>
  </tr>`;
  });
  bodyData.innerHTML = innerHTML;
};

const deleteGame = async function (gameIndex) {
  if (isLoggedIn) {
    const data = {
      game: gameIndex
    };
    
    const response = await fetch("/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const newData = await response.json();

    updateData(newData);
  }
};

const modifyGame = async function (gameIndex) {
  const game = document.getElementById("game").value;
  const genre = document.getElementById("genre").value;
  const cost = document.getElementById("cost").value;
  const discount = document.getElementById("discount").value;
  const data = { game, genre, cost, discount };

  const postResponse = await fetch(`/modify/${gameIndex}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const newData = await postResponse.json();

  updateData(newData);
};

const login = async function (event) {
  if (!isLoggedIn) {
    event.preventDefault();

    username = document.getElementById("username").value;
    password = document.getElementById("password").value;

    const data = {
      username: username,
      password: password,
    };

    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const newData = await response.json();

    if (newData.username != username || newData.password != password) {
      isLoggedIn = false;
      alert("Incorrect Password");
    } else {
      isLoggedIn = true;

      getResponse();
    }
  }
};

const getResponse = async function (event) {
  if (isLoggedIn) {
    const response = await fetch(`/data/${username}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const newData = await response.json();

    updateData(newData);
  }
};

let username,
  password,
  isLoggedIn = null;

window.onload = async function () {
  isLoggedIn = false;
  const submitButton = document.getElementById("submit");
  submitButton.onclick = submit;
  const loginButton = document.getElementById("login");
  loginButton.onclick = login;

  getResponse();
};
