const http = require("http"),
  fs = require("fs"),
  mime = require("mime"),
  dir = "public/",
  port = 3000;

let tasks = [];

const server = http.createServer((request, response) => {
  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {
    handlePost(request, response);
  }
});

const handleGet = (request, response) => {
  const filename = dir + request.url.slice(1);

  if (request.url === "/") {
    sendFile(response, "public/index.html");
  } else if (request.url === "/tasks") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(tasks));
  } else {
    sendFile(response, filename);
  }
};

const handlePost = (request, response) => {
  let dataString = "";

  request.on("data", (data) => {
    dataString += data;
  });

  request.on("end", () => {
    const receivedData = JSON.parse(dataString);

    if (request.url === "/add") {
      const creationDate = new Date().toISOString().split("T")[0];
      const deadline = calculateDeadline(creationDate, receivedData.priority);
      const newTask = {
        task: receivedData.task,
        priority: receivedData.priority,
        creation_date: creationDate,
        deadline: deadline,
      };
      tasks.push(newTask);
      response.writeHead(200, "OK", { "Content-Type": "text/plain" });
      response.end("Task added successfully");
    } else if (request.url === "/delete") {
      const index = receivedData.index;
      tasks.splice(index, 1);
      response.writeHead(200, "OK", { "Content-Type": "text/plain" });
      response.end("Task deleted successfully");
    } else if (request.url === "/edit") {
      const index = receivedData.index;
      tasks[index].task = receivedData.task;
      tasks[index].priority = receivedData.priority;
      tasks[index].deadline = calculateDeadline(tasks[index].creation_date, receivedData.priority);
      response.writeHead(200, "OK", { "Content-Type": "text/plain" });
      response.end("Task edited successfully");
    }
  });
};

const calculateDeadline = (creationDate, priority) => {
  const date = new Date(creationDate);
  date.setDate(date.getDate() + (priority === "High" ? 1 : 3));
  return date.toISOString().split("T")[0];
};

const sendFile = (response, filename) => {
  const type = mime.getType(filename);

  fs.readFile(filename, (err, content) => {
    if (err === null) {
      response.writeHead(200, { "Content-Type": type });
      response.end(content);
    } else {
      response.writeHead(404);
      response.end("404 Error: File Not Found");
    }
  });
};

server.listen(process.env.PORT || port);
