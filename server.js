const http = require("http"),
    fs = require("fs"),
    // IMPORTANT: you must run `npm install` in the directory for this assignment
    // to install the mime library if you're testing this on your local machine.
    // However, Glitch will install it automatically by looking in your package.json
    // file.
    mime = require("mime"),
    dir = "public/",
    port = 3000;

const appdata = [
  { name: "John Doe", foodName: "Burger", foodPrice: 10, quantity: 2 },
  { name: "Jane Smith", foodName: "Fries", foodPrice: 5, quantity: 1 },
];

const server = http.createServer(function (request, response) {
  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {
    handlePost(request, response);
  } else if (request.method === "DELETE") {
    handleDelete(request, response);
  } else if (request.method === "PUT") {
    handlePut(request, response);
  }
});

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1);

  if (request.url === "/") {
    sendFile(response, "public/index.html");
  } else if (request.url === "/orders") {
    // Respond with the current state of appdata (array of orders)
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ appdata: appdata })); // Sending appdata to the frontend
  } else {
    sendFile(response, filename);
  }
};

const foodOptions = {
  10: "Burger",
  5: "Fries",
  3: "Milkshake",
};

// Global variable to store the cumulative total price (in a real-world scenario, this would likely be stored in a database)
let cumulativeTotalPrice = 0;

const handlePost = function (request, response) {
  let dataString = "";

  // Collect the data from the request
  request.on("data", function (data) {
    dataString += data;
  });

  // Once all the data has been received, process it
  request.on("end", function () {
    const orderData = JSON.parse(dataString); // Parse the received data

    const foodPrice = parseInt(orderData.food); // Extract food price from the data
    const quantity = parseInt(orderData.quantity); // Extract quantity from the data

    // Calculate the total price for this order
    const orderTotalPrice = foodPrice * quantity;

    // Update the cumulative total price
    cumulativeTotalPrice = orderData.cumulativeTotalPrice + orderTotalPrice;

    console.log(
        `Received order: ${orderData.name} ordered ${quantity} x ${foodOptions[foodPrice]} ($${foodPrice} each)`
    );
    console.log(`Order total price: $${orderTotalPrice}`);
    console.log(`Cumulative total price: $${cumulativeTotalPrice}`);

    // Create a new order object
    const newOrder = {
      name: orderData.name,
      foodName: foodOptions[foodPrice], // Map the food price to the corresponding food name
      foodPrice: foodPrice,
      quantity: quantity,
    };

    // Append the new order to the appdata array
    appdata.push(newOrder);

    // Log the updated appdata for debugging
    console.log("Orders made: ", appdata);

    // Respond to the client with a message and optionally the updated appdata array
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(
        JSON.stringify({
          message: `Order received. ${orderData.name} ordered ${quantity} x ${foodOptions[foodPrice]} ($${foodPrice} each)`,
          appdata: appdata, // Return the updated appdata array
        })
    );
  });
};

// Handle PUT request for editing an order
const handlePut = function (request, response) {
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    const orderData = JSON.parse(dataString);
    const index = orderData.index; // Get the index of the item to edit

    if (index < 0 || index >= appdata.length) {
      response.writeHead(400, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ message: "Invalid index" }));
      return;
    }

    // Update the item at the given index
    appdata[index] = {
      name: orderData.name,
      foodName: orderData.foodName,
      foodPrice: orderData.foodPrice,
      quantity: orderData.quantity,
    };

    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(
        JSON.stringify({ message: "Order updated", appdata: appdata })
    );
  });
};

// Handle DELETE request for deleting an order
const handleDelete = function (request, response) {
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    const { index } = JSON.parse(dataString); // Get the index of the item to delete

    if (index < 0 || index >= appdata.length) {
      response.writeHead(400, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ message: "Invalid index" }));
      return;
    }

    // Remove the item from appdata
    appdata.splice(index, 1);

    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(
        JSON.stringify({ message: "Order deleted", appdata: appdata })
    );
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
