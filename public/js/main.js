const submit = async function (event) {
  event.preventDefault();

  const name = document.querySelector("#name").value,
    date = document.querySelector("#date").value,
    sold = document.querySelector("#sold").value,
    capacity = document.querySelector("#capacity").value;

  let status = "";
  if (sold >= capacity) {
    status = "Sold Out";
  } else {
    status = "Filling";
  }

  const json = {
      name: name,
      date: date,
      sold: parseInt(sold),
      capacity: parseInt(capacity),
      status: status,
    },
    body = JSON.stringify(json);

  const response = await fetch("/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  const data = await response.json();

  makeTable(data);
};

const edit = async function (event) {
  event.preventDefault();

  const name = document.querySelector("#name").value,
    date = document.querySelector("#date").value,
    sold = document.querySelector("#sold").value,
    capacity = document.querySelector("#capacity").value;

  let status = "";
  if (sold >= capacity) {
    status = "Sold Out";
  } else {
    status = "Filling";
  }

  const json = {
      name: name,
      date: date,
      sold: parseInt(sold),
      capacity: parseInt(capacity),
      status: status,
    },
    body = JSON.stringify(json);

  const response = await fetch("/edit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  const data = await response.json();

  makeTable(data);
};

const del = async function (event) {
  event.preventDefault();

  const name = document.querySelector("#name").value;

  const json = {
      name: name,
    },
    body = JSON.stringify(json);

  const response = await fetch("/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  const data = await response.json();

  makeTable(data);
};

const makeTable = function (data) {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";

  data.forEach(function (event) {
    const row = document.createElement("tr");
    row.innerHTML =
      "<td>" +
      event.name +
      "</td><td>" +
      event.date +
      "</td><td>" +
      event.sold +
      "</td><td>" +
      event.capacity +
      "</td><td>" +
      event.status +
      "</td>";
    tbody.appendChild(row);
  });
};

window.onload = function () {
  const subButton = document.getElementById("submit");
  subButton.onclick = submit;

  const editButton = document.getElementById("edit");
  editButton.onclick = edit;

  const delButton = document.getElementById("delete");
  delButton.onclick = del;
};
