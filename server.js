const http = require("http"),
    fs = require("fs"),
    // IMPORTANT: you must run `npm install` in the directory for this assignment
    // to install the mime library if you're testing this on your local machine.
    // However, Glitch will install it automatically by looking in your package.json
    // file.
    mime = require("mime"),
    dir = "public/",
    port = 3000;

const appdata = [];

const server = http.createServer(function (request, response) {
    if (request.method === "GET") {
        handleGet(request, response);
    } else if (request.method === "PUT") {
        handlePut(request, response);
    } else if (request.method === "POST") {
        handlePost(request, response);
    } else if (request.method === "DELETE") {
        handleDelete(request, response);
    }
});

const handleGet = function (request, response) {
    const filename = dir + request.url.slice(1);

    if (request.url === "/") {
        sendFile(response, "public/index.html");
    } else if (request.url === "/data") {
        response.writeHeader(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(appdata));
    } else {
        sendFile(response, filename);
    }
};

const handlePut = function (request, response) {
    let dataString = "";

    request.on("data", function (data) {
        dataString += data;
    });

    request.on("end", function () {
        const parsed = JSON.parse(dataString);
        const { index, ...rest } = parsed;
        appdata[index] = rest;

        console.log(appdata);

        response.writeHead(200, "OK", { "Content-Type": "text/plain" });
        response.end("Data updated successfully");
    });
};

const handlePost = function (request, response) {
    let dataString = "";

    request.on("data", function (data) {
        dataString += data;
    });

    request.on("end", function () {
        const parsed = JSON.parse(dataString);
        // Derived value
        parsed.total = parsed.price * parsed.quantity;

        appdata.push(parsed);

        response.writeHead(200, "OK", { "Content-Type": "text/plain" });
        response.end("Data updated successfully");
    });
};

const handleDelete = function (request, response) {
    let dataString = "";

    request.on("data", function (data) {
        dataString += data;
    });

    request.on("end", function () {
        const parsed = JSON.parse(dataString);
        const { index } = parsed;
        appdata.splice(index, 1);

        response.writeHead(200, "OK", { "Content-Type": "text/plain" });
        response.end("Data deleted successfully");
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
