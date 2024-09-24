const http = require("http"),
  fs = require("fs"),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library if you're testing this on your local machine.
  // However, Glitch will install it automatically by looking in your package.json
  // file.
  mime = require("mime"),
  dir = "public/",
  port = 4001;

const appdata = [
  { name: "Kay", score: 132, date: (new Date("July 6, 2023 1:23:45 AM")).toDateString() },
  { name: "Taylor", score: 42, date: (new Date("September 8, 2024 2:30:00 PM")).toDateString() },
  { name: "test", score: 1, date: (new Date()).toDateString()},
];

const server = http.createServer(function (request, response) {
  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {
    handlePost(request, response);
  }
});

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1);

  if (request.url === "/") {
    sendFile(response, "public/index.html");
  } else if (request.url === "/data") {
    response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    response.end(JSON.stringify(appdata));
  } else {
    sendFile(response, filename);
  }
};

// Sort and then send the current table
const sortAndSend = function (request, response) {
  appdata.sort(function (a, b) {
    return b.score - a.score;
  });

  response.writeHead(200, "OK", { "Content-Type": "text/plain" });
  response.end(JSON.stringify(appdata));
};

const handlePost = function (request, response) {
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    if (request.url === "/submit") {
      console.log(JSON.parse(dataString));
      const data = JSON.parse(dataString);
      let updated = false;
      for (var i = 0; i < appdata.length; i++) {
        if (data.name === appdata[i].name) {
          appdata[i].score = data.score;
          updated = true;
        }
      }
      if (!updated) {
        console.log("name " + data.name);
        appdata.push({ name: data.name, score: data.score, date: (new Date()).toDateString() });
      }

      sortAndSend(request, response);
    } else if (request.url === "/delete") {
      const data = JSON.parse(dataString);
      console.log("Received delete request for " + dataString);
      let idx = undefined;
      for (let i = 0; i < appdata.length; i++) {
        if (appdata[i].name === data.name) {
          idx = i;
        }
      }
      if (idx != undefined) {
        console.log("Deleting.");
        appdata.splice(idx, 1);
      }
      sortAndSend(request, response);
    }
  });
};

const sendFile = function (response, filename) {
  const type = mime.getType(filename);

  fs.readFile(filename, function (err, content) {
    // if the error = null, then we've loaded the file successfully
    if (err === null) {
      // status code: https://httpstatuses.com
      response.writeHeader(200, { "Content-Type": type });
      response.end(content);
    } else {
      // file not found, error code 404
      response.writeHeader(404);
      response.end("404 Error: File Not Found");
    }
  });
};

server.listen(process.env.PORT || port);