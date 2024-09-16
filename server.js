const http = require('http'),
  fs = require('fs'),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library if you're testing this on your local machine.
  // However, Glitch will install it automatically by looking in your package.json
  // file.
  mime = require('mime'),
  dir = 'public/',
  port = 3000

let appdata = [];

const server = http.createServer(function (request, response) {
  if (request.method === 'GET') {
    handleGet(request, response);
  } else if (request.method === 'POST') {
    handlePost(request, response);
  } else if (request.method === 'DELETE') {
    handleDelete(request, response);
  }
})

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1);
  if (request.url === '/') {
    sendFile(response, 'public/index.html');
  }
  else if (request.url === '/data') {
    response.end(JSON.stringify(appdata));
  }
  else {
    sendFile(response, filename);
  }
}

const handlePost = function (request, response) {
  let dataString = '';

  request.on('data', function (data) {
    dataString += data;
  })

  request.on('end', function () {
    const newData = JSON.parse(dataString);

    console.log("newData", newData)
    console.log("classcode", newData[0].classCode)
    const classCode = newData[0].classCode;
    const className = newData[0].className;
    const assignment = newData[0].assignment;
    const daysLeft = newData[0].daysLeft;
    let daysToAdd = parseInt(daysLeft);
    if (isNaN(daysLeft)) {
      //Is not a number
      daysToAdd = 0;
    }
    if (daysToAdd === null) {
      daysToAdd = 0;
    }
    let date = new Date();
    date.setDate(date.getDate() + daysToAdd);

    appdata.push({
      'classCode': classCode,
      'className': className,
      'assignment': assignment,
      'daysLeft': daysLeft,
      'dueDate': date.toDateString()
    });
    console.log("appdata:", appdata)

    response.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
    response.end(JSON.stringify(appdata))
  })
}

handleDelete = function (request, response) {
  let dataString = '';

  request.on('data', function (data) {
    dataString += data;
  })

  request.on('end', function () {
    if (appdata.length > 0) {
      appdata.pop();
    }

    console.log("appdata:", appdata)

    response.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
    response.end(JSON.stringify(appdata))
  })
}

const sendFile = function (response, filename) {
  const type = mime.getType(filename);

  fs.readFile(filename, function (err, content) {

    // if the error = null, then we've loaded the file successfully
    if (err === null) {

      // status code: https://httpstatuses.com
      response.writeHeader(200, { 'Content-Type': type })
      response.end(content)

    } else {

      // file not found, error code 404
      response.writeHeader(404)
      response.end('404 Error: File Not Found')

    }
  })
}

server.listen(process.env.PORT || port)
