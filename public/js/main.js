let username, password = null;

const submit = async function (event) {
  if(loggedIn) {
    event.preventDefault();

    const game = document.getElementById("game").value;
    const genre = document.getElementById("genre").value;
    const cost = document.getElementById("cost").value;
    const discount = document.getElementById("discount").value;
    let amountOff = (parseInt(discount) / 100) * parseInt(cost);
      if (isNaN(amountOff) || amountOff === null) {
        amountOff = 0;
      }
    const data = { game, genre, cost, discount, discountCost: cost - amountOff, username, password };

    const postResponse = await fetch("/submit", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
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
    <td><button class="button" onclick="deleteGame(${index})" id="delete">Delete</button></td>
    <td><button class="button" onclick="modifyGame(${index})" id="modify">Modify</button></td>
  </tr>`;
  });
  bodyData.innerHTML = innerHTML;
};

const deleteGame = async function (index) {
  if(loggedIn) {
    const response = await fetch("/delete", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(index),
    });
    const newData = await response.json();

    updateData(newData);
  }
};

const modifyGame = async function (index) {
  const game = document.getElementById("game").value;
  const genre = document.getElementById("genre").value;
  const cost = document.getElementById("cost").value;
  const discount = document.getElementById("discount").value;
  const data = { game, genre, cost, discount };

  const postResponse = await fetch("/modify", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const newData = await postResponse.json();

  updateData(newData);
}

const login = async function (event) {
	if (!loggedIn) {
		event.preventDefault();

		username = document.getElementById("username").value;
		password = document.getElementById("password").value;

		const data = {
			"username": username,
			"password": password
		};

		const response = await fetch('/login', {
			method: 'POST',
			headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
		});

		const newData = await response.json();

		if (newData.username != username || newData.password != password) {
			loggedIn = false;
      alert("Incorrect Password");
		}
		else {
			loggedIn = true;
			
      getResponse();
		}
	}
}

const getResponse = async function (event) {
  if (loggedIn) {
		const response = await fetch(`/data/${username}`, {
			method: 'GET',
			headers: { "Content-Type": "application/json" },
		});
		const newData = await response.json();
		
    updateData(newData);
	}
}

window.onload = async function () {
  loggedIn = false;
  const submitButton = document.getElementById("submit");
  submitButton.onclick = submit;
  const loginButton = document.getElementById("login");
  loginButton.onclick = login;

  getResponse();
};
