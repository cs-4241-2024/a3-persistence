const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000;

let appdata = [ // name price quantity total
  //{"name": "apple", "price": "1.00", "quantity": "5", "total": "5.00", "id":"0"}
  
]

const server = http.createServer(function(request, response) { // basic server
  if(request.method === 'GET') { // receiving data from client
    handleGet(request, response)    
  }
  else if( request.method === 'POST') { // sending data back to client
    handlePost(request, response) 
  }
  else if (request.method === "PUT") { // case for editing data
    handlePut(request, response);
  }
  else if (request.method === "DELETE") { // case for deleting data
    handleDelete(request, response);
  } 
})

function validateForm(x) { // severside function for handling invalid (blank) data
  //var x = document.forms["myForm"]["fname"].value;
  if (x.name == null || x.name == "") {
      alert("Name must be filled out");
      return false;
  }
}

const handleGet = function(request, response) { // function for handling GET request
  const filename = dir + request.url.slice(1) 

  if(request.url === "/") {
    sendFile( response, "public/index.html")
  }
  else if (request.url === "/results.html") {
    console.log("sending results.html");
    response.end(JSON.stringify(appdata));
    console.log(appdata);

    validateForm(appdata.id);

    sendFile(response, "public/results.html");
    console.log("results sent");
  }
  else {
    sendFile(response, filename)
  }
}

let nextId = 1;

const handlePost = function(request, response) { // function for handling POST request
  let dataString = "" // empty string of data to send to client

  request.on("data", function(data) {
      dataString += data // add to datastring
  });

  request.on("end", function() {
    console.log(JSON.parse(dataString))

    let newEntry = JSON.parse(dataString); // converts string into JSON format
    newEntry.total = newEntry.price * newEntry.quantity; // calculate total cost
    newEntry.id = nextId++;
    
    JSON.stringify(newEntry);
    console.log(newEntry.id);
    
    appdata.push(newEntry); // add to array

    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    response.end(JSON.stringify(appdata))
  });
};

const handleDelete = function (request, response) { // function for handling DELETE request
  const id = parseInt(request.url.split("/")[2], 10); // splits url to get path
  console.log(`Deleting entry with ID: ${id}`);

  appdata = appdata.filter((entry) => entry.id !== id);
  response.writeHead(200, "OK", { "Content-Type": "application/json" });
  response.end(JSON.stringify(appdata));
};

const handlePut = function(request, response) { // function for handling PUT request
  const id = parseInt(request.url.split("/")[2], 10);
  let dataString = "";

  request.on("data", function(data) {
    dataString += data;
  });
  
  request.on("end", function() { // update table info
    const updatedEntry = JSON.parse(dataString); // parse new received datastring
    const entryIndex = appdata.findIndex((entry) => entry.id === id);
    updatedEntry.total = updatedEntry.price * updatedEntry.quantity; // calculate total cost
    
    appdata[entryIndex] = {id, ...updatedEntry}; // update the table entry
    console.log("Updated entry:", appdata[entryIndex]);
    response.writeHead(200, "OK", {"Content-Type": "application/json"});
    response.end(JSON.stringify(appdata));
  });
};

const sendFile = function(response, filename) {
   const type = mime.getType(filename);

   fs.readFile( filename, function(err, content) {

     // if the error = null, then we've loaded the file successfully
     if(err === null) {

       // status code: https://httpstatuses.com
       response.writeHeader(200, {"Content-Type": type});
       response.end(content);

     }else{

       // file not found, error code 404
       response.writeHeader(404);
       response.end("404 Error: File Not Found");
     }
   })
}

server.listen( process.env.PORT || port );
