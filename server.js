const http = require('http'),
      fs = require('fs'),
      mime = require('mime'),
      dir = 'public/',
      port = 3000

const appdata = [
  { 'employeeid': '123456789', 'name': 'John Doe', 'salary': 57000, 'regdate': 2021, 'expdate': 2026 },
  { 'employeeid': '987563409', 'name': 'Jack Smith', 'salary': 75000, 'regdate': 2019, 'expdate': 2024 },
  { 'employeeid': '456891237', 'name': 'Jane Lee', 'salary': 90000, 'regdate': 2020, 'expdate': 2025 }
];

const server = http.createServer(function (request, response) {
  if (request.method === 'GET') {
    handleGet(request, response);
  } else if (request.method === 'POST') {
    if (request.url === '/submit') {
      handlePost(request, response);
    } else if (request.url.startsWith('/edit/')) {
      handleEdit(request, response);
    }
  } else if (request.method === 'DELETE') {
    if (request.url.startsWith('/delete/')) {
      handleDelete(request, response);
    }
  }
});

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1);

  if (request.url === '/') {
    sendFile(response, 'public/index.html');
  } else if (request.url === '/data') {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(appdata));
  } else {
    sendFile(response, filename);
  }
};

const handlePost = function (request, response) {
  let dataString = '';

  request.on('data', function (data) {
    dataString += data;
  });

  request.on('end', function () {
    const newData = JSON.parse(dataString);

    const newEntry = {
      employeeid: newData.employeeid,
      name: newData.yourname,
      salary: newData.salary,
      regdate: newData.regdate,
      expdate: parseInt(newData.regdate) + 5
    };

    appdata.push(newEntry);

    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(appdata));
  });
};

const handleEdit = function (request, response) {
  const index = parseInt(request.url.split('/')[2]);
  let dataString = '';

  request.on('data', function (data) {
    dataString += data;
  });

  request.on('end', function () {
    const updatedData = JSON.parse(dataString);
    appdata[index] = {
      employeeid: updatedData.employeeid,
      name: updatedData.name,
      salary: updatedData.salary,
      regdate: updatedData.regdate,
      expdate: parseInt(updatedData.regdate) + 5
    };

    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(appdata));
  });
};

const handleDelete = function (request, response) {
  const index = parseInt(request.url.split('/')[2]);
  appdata.splice(index, 1);

  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(appdata));
};

const sendFile = function (response, filename) {
  const type = mime.getType(filename);

  fs.readFile(filename, function (err, content) {
    if (err === null) {
      response.writeHeader(200, { 'Content-Type': type });
      response.end(content);
    } else {
      response.writeHeader(404);
      response.end('404 Error: File Not Found');
    }
  });
};

server.listen(process.env.PORT || port);
