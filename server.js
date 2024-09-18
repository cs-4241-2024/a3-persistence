//const http = require("http");
const fs = require("fs");
// IMPORTANT: you must run `npm install` in the directory for this assignment
// to install the mime library if you're testing this on your local machine.
// However, Glitch will install it automatically by looking in your package.json
// file.
const mime = require("mime");
const dir = "public/";
const port = 3000;

const express = require("express");
//const { MongoClient, ObjectId } = require("mongodb");
const app = express();

app.use(express.static("public"));
app.use(express.json());

/*const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient( uri )

let collection = null

/*async function run() {
  await client.connect()
  collection = await client.db("datatest").collection("test")

  // route to get all docs
  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json( docs )
    }
  })
}

run()

app.listen(3000)*/

let appdata = [];

/*const server = http.createServer(function (request, response) {
  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {
    handlePost(request, response);
  } else if (request.method === "DELETE") {
    handleDelete(request, response);
  }
});

/*const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1);

  if (request.url === "/") {
    sendFile(response, "public/index.html");
  } else if (request.url === "/data") {
    response.end(JSON.stringify(appdata));
  } else {
    sendFile(response, filename);
  }
};*/

app.get("/data", async (request, response) => {
  const filename = dir + request.url.slice(1);

  if (request.url === "/") {
    sendFile(response, "public/index.html");
  } else if (request.url === "/data") {
    response.end(JSON.stringify(appdata));
  } else {
    sendFile(response, filename);
  }
});

/*const handlePost = function (request, response) {
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    const newData = JSON.parse(dataString);

    const game = newData.game;
    const genre = newData.genre;
    const cost = newData.cost;
    const discount = newData.discount;
    let amountOff = (parseInt(discount) / 100) * parseInt(cost);
    if (isNaN(amountOff) || amountOff === null) {
      amountOff = 0;
    }

    appdata.push({
      game,
      genre,
      cost,
      discount,
      discountCost: cost - amountOff,
    });

    response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    response.end(JSON.stringify(appdata));
  });
};*/

app.post("/submit", async (request, response) => {
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    const newData = JSON.parse(dataString);

    const game = newData.game;
    const genre = newData.genre;
    const cost = newData.cost;
    const discount = newData.discount;
    let amountOff = (parseInt(discount) / 100) * parseInt(cost);
    if (isNaN(amountOff) || amountOff === null) {
      amountOff = 0;
    }

    appdata.push({
      game,
      genre,
      cost,
      discount,
      discountCost: cost - amountOff,
    });

    response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    response.end(JSON.stringify(appdata));
  });
});

/*const handleDelete = function (request, response) {
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    const json = JSON.parse(dataString);
    const index = json.index;
    appdata.splice(index, 1);

    response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    response.end(JSON.stringify(appdata));
  });
};*/

app.delete("/data", async (request, response) => {
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    const json = JSON.parse(dataString);
    const index = json.index;
    appdata.splice(index, 1);

    response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    response.end(JSON.stringify(appdata));
  });
});

const sendFile = function (response, filename) {
  const type = mime.getType(filename);

  fs.readFile(filename, function (err, content) {
    if (err === null) {
      response.writeHeader(200, { "Content-Type": type });
      response.end(content);
    } else {
      response.writeHeader(404);
      response.end("404 Error: File Not Found");
    }
  });
};

//server.listen(process.env.PORT || port);
app.listen(process.env.PORT);
