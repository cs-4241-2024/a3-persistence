const submit = async function (event) {
  event.preventDefault();

  const game = document.getElementById("game").value;
  const genre = document.getElementById("genre").value;
  const cost = document.getElementById("cost").value;
  const discount = document.getElementById("discount").value;
  const data = { game, genre, cost, discount };

  const postResponse = await fetch("/submit", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const getResponse = await fetch("/data", {
    method: "GET",
  });
  const newData = await getResponse.json();

  updateData(newData);
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
  </tr>`;
  });
  bodyData.innerHTML = innerHTML;
};

const deleteGame = async function (index) {
  const response = await fetch("/data", {
    method: "DELETE",
    body: JSON.stringify({ index }),
  });
  const newData = await response.json();

  updateData(newData);
};

window.onload = async function () {
  const submitButton = document.getElementById("submit");
  submitButton.onclick = submit;

  const getResponse = await fetch("/data", {
    method: "GET",
  });
  const newData = await getResponse.json();

  updateData(newData);
};