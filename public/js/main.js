import {resetGame} from "/js/snake.js"

const add_rows_to_table = function (table, data) {
  var tmp_tbody = document.createElement("tbody");
  let name = document.createElement("th");
  name.innerText = "Name";
  let score = document.createElement("th");
  score.innerText = "Score";
  let rank = document.createElement("th");
  rank.innerText = "Date";

  let header_row = tmp_tbody.insertRow();
  header_row.appendChild(name);
  header_row.appendChild(score);
  header_row.appendChild(rank);

  for (var i = 0; i < data.length; i++) {
    let row = tmp_tbody.insertRow();
    let cell = row.insertCell();
    row.id = "row" + toString(i);
    cell.innerText = data[i].name;
    cell = row.insertCell();
    cell.innerText = data[i].score;
    cell = row.insertCell();
    cell.innerText = data[i].date;
  }
  var tbody = document.getElementById("score_tbody");
  tbody.innerHTML = tmp_tbody.innerHTML;
  tmp_tbody.remove();
};

const update_table = function (data) {
  const table = document.getElementById("score_table");
  const rows = table.rows;
  for (var i = 0; i < rows.length; i++) {
    table.deleteRow(0);
  }
  add_rows_to_table(table, data);
};

const delete_row = async function (event) {
  event.preventDefault();
  const name = document.getElementById("removeField").value;
  if (name == null) return;
  const json = { name };
  const body = JSON.stringify(json);

  console.log("requesting delete for " + body);

  const response = await fetch("/delete", { 
    method: "POST", 
    headers: {
      "Content-Type": "application/json"
    },
    body });

  const data = await response.json();

  update_table(data);
};

const submit = async function (event) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault();

  const name = document.getElementById("nameField").value;
  // need to do a little processing to get the score to only be the number
  let score = document.getElementById("score").innerText;
  score = score.split(" ")[1];
  // Log for debugging
  console.log("Name:", name, "Score", score)
  let json, body;
  (json = { name, score }), (body = JSON.stringify(json));

  console.log("sending " + body);

  const response = await fetch("/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body,
  });

  const data = await response.json();
  console.log(data);
  update_table(data);
  closeForm();
  resetGame();
};

const get_data = async function () {
  const response = await fetch("/data", {
    method: "GET",
  });

  const data = await response.json();

  const table = document.getElementById("score_table");
  console.log(data.length);

  add_rows_to_table(table, data);

  console.log(data);
};

export function openForm() {
  document.getElementById("submitScore").style.display = "block";
}

export async function closeForm() {
  resetGame();
  document.getElementById("submitScore").style.display = "none";
} 

window.onload = function () {
  get_data();
  const submit_button = document.querySelector("#submit-button");
  submit_button.onclick = submit;
  
  document.getElementById("close-button").onclick = closeForm;
  document.getElementById("delete-button").onclick = delete_row;

};