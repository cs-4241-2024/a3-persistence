require('dotenv').config();

const http = require("http"),
  fs = require("fs"),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library if you're testing this on your local machine.
  // However, Glitch will install it automatically by looking in your package.json
  // file.
  mime = require("mime"),
  dir = "public/",
  express = require("express"),
  app = express(),
  port = 3000;

app.use(express.static("public"));
app.use(express.static("views"));

app.listen(process.env.PORT || 3000);

const appdata = {
  rows:
    [
      {
        key: "a",
        task: "Say Hello",
        due: "2024-09-12",
        done: false,
        daysLeft: 0
      }
    ]
}

// Get back a JSON object with the row's data
const getRowByKey = function (key) {
  for (let row of appdata.rows) {
    // Intentionally allowing type conversion
    if (row.key == key) {
      return row;
    }
  }
  console.log("data: ", appdata);
  console.log("Bad row request. Requested key: ", key);
  return null;
}

const handleGet = function (request, response) {
  response.writeHead(200, "OK", { "Content-Type": "text/plain" });
  response.end(JSON.stringify(appdata));
};

// Sort and then send the current table
const sortAndSend = function (request, response) {
  appdata.rows.sort(function (a, b) {
    // Principally sort by done-ness
    let aint = a.done ? 1 : 0;
    let bint = b.done ? 1 : 0;
    console.log("a.done ", a.done, " aint, ", aint, " b.done ", b.done, " bint ", bint);
    let diff = aint - bint;
    if (diff === 0) {
      // If same done-ness, sort by days left
      diff = b.daysLeft - a.daysLeft;
      console.log("sorting by date");
      if (diff === 0) {
        // If same days left, sort alphabetically
        diff = a.task.localeCompare(b.task);
      }
    }
    return diff;
  });
  response.writeHead(200, "OK", { "Content-Type": "text/plain" });
  response.end(JSON.stringify(appdata));
};

const handleSubmit = function (request, response) {
  console.log("handleSubmit: " + JSON.stringify(request.body));
  const requestData = request.body;
  requestData.key = Math.random();
  let dateObj = new Date(requestData.due);
  let today = new Date();
  requestData.daysLeft = dateObj.getDate() - today.getDate() + 1;
  console.log("handleSubmit: today.getDate() ", today.getDate(), " dateObj.getDate() ", dateObj.getDate());

  appdata.rows.push(requestData);

  sortAndSend(request, response);
};

const handleDelete = function (request, response) {
  const data = request.body;
  console.log("Received delete request for " + JSON.stringify(request.body));
  let idx = undefined;
  for (let i = 0; i < appdata.rows.length; i++) {
    if (appdata.rows[i].key == data.key) {
      console.log("Found row");
      idx = i;
      break;
    }
  }
  if (idx != undefined) {
    console.log("Deleting.");
    appdata.rows.splice(idx, 1);
  }
  sortAndSend(request, response);
};

const tickBox = function (request, response) {
  console.log("Box request, ", request.body);
  const data = request.body;
  const key = data.key;
  const value = data.value;
  let row = getRowByKey(key);
  row.done = value;
  console.log("Set done to ", row.done);

  sortAndSend(request, response);
}

app.get("/data", handleGet);
app.post("/add-new-data", express.json(), handleSubmit);
app.post("/delete", express.json(), handleDelete);
app.post("/update-box", express.json(), tickBox);
