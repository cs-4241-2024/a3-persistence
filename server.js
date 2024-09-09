const http = require("http"),
  fs = require("fs"),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library if you're testing this on your local machine.
  // However, Glitch will install it automatically by looking in your package.json
  // file.
  mime = require("mime"),
  dir = "public/",
  port = 3000;

// To aid in testing and grading, these example (but real) times are preloaded on the server.
const highscores = [
  [18.6, 13.3, 16.7, 48.7],
  [12.5, 12.6, 13.9, 39.1],
  [23.8, 21.2, 24.4, 69.5],
  [13.3, 10, 11.3, 34.7],
];

const server = http.createServer(function (request, response) {
  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {
    handlePost(request, response);
  } else if (request.method === "DELETE") {
    handleDelete(request, response);
  }
});

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1);

  if (request.url === "/highscores") {
    // Get all data from the server
    response.writeHeader(200, { "Content-Type": "text/plain" });
    response.end(JSON.stringify(highscores));
  } else if (request.url === "/") {
    sendFile(response, "public/index.html");
  } else {
    sendFile(response, filename);
  }
};

const handlePost = function (request, response) {
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    if (request.url === "/shuffle") {
      // Swap two lap times randomly, for fun
      const toSwap = Math.floor(Math.random() * 3);
      const row = parseInt(dataString);

      const temp = highscores[row][toSwap];
      highscores[row][toSwap] = highscores[row][(toSwap + 1) % 3];
      highscores[row][(toSwap + 1) % 3] = temp;

      response.writeHeader(200, { "Content-Type": "text/plain" });
      response.end("Success");
    } else if (request.url === "/submit") {
      // Submit a race time to the server
      const raceTime = JSON.parse(dataString);

      const raceTotal = raceTime[0] + raceTime[1] + raceTime[2];
      raceTime.push(raceTotal);
      highscores.push(raceTime);

      response.writeHead(200, "OK", { "Content-Type": "text/plain" });
      response.end("Success");
    }
  });
};

const handleDelete = function (request, response) {
  // Delete an entry from the server
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    const row = parseInt(dataString);

    highscores.splice(row, 1);

    response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    response.end("Success");
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
