const http = require('http'),
      fs   = require('fs'),
      mime = require('mime'),
      dir  = 'public/',
      port = 3000;

let studentData = [
  { 'name': 'John Doe', 'age': 20, 'year': 2, 'grade': 85, 'status': calculateStatus(85) },
  { 'name': 'Jane Doe', 'age': 22, 'year': 4, 'grade': 72, 'status': calculateStatus(72) }
];

const server = http.createServer(function (request, response) {
  console.log(`Received request: ${request.method} ${request.url}`);
  if (request.method === 'GET') {
    handleGet(request, response);
  } else if (request.method === 'POST') {
    handlePost(request, response);
  }
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const handleGet = function (request, response) {
  const filename = dir + (request.url === '/' ? 'index.html' : request.url.slice(1));

  if (request.url === '/data') {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(studentData));
  } else {
    fs.readFile(filename, function (err, content) {
      if (err) {
        console.error('Error reading file:', err);
        response.writeHead(404);
        response.end('404 Error: File Not Found');
      } else {
        response.writeHead(200, { 'Content-Type': mime.getType(filename) });
        response.end(content);
      }
    });
  }
};

const handlePost = function (request, response) {
  let dataString = '';

  request.on('data', function (data) {
    dataString += data;
  });

  request.on('end', function () {
    const data = JSON.parse(dataString);

    if (request.url === '/student') {
      if (data.action === 'add') {
        data.status = calculateStatus(data.grade);
        studentData.push(data);
      } else if (data.action === 'delete') {
        studentData = studentData.filter(student => student.name !== data.name);
      }

      response.writeHead(200, 'OK', { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(studentData));
    }
  });
};

function calculateStatus(grade) {
  return grade >= 60 ? 'Passed' : 'Failed';
}

