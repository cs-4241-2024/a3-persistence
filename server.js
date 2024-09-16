// const http = require( 'http' ),
//       fs   = require( 'fs' ),
//       // IMPORTANT: you must run `npm install` in the directory for this assignment
//       // to install the mime library if you're testing this on your local machine.
//       // However, Glitch will install it automatically by looking in your package.json
//       // file.
//       mime = require( 'mime' ),
//       dir  = 'public/',
//       port = 3000
// const express = require('express');
// const app = express();
// const PORT = process.env.PORT || 3000;
// const mongoose = require('mongoose');


// // Connect to MongoDB
// mongoose.connect('mongodb+srv://asjacob:Webware25@cluster0.9xsgz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//   console.log('Connected to MongoDB');
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

require("dotenv").config();

const express = require("express"),
      { MongoClient, ObjectId } = require("mongodb"),
      app = express()

app.use(express.static("public") )
app.use(express.json() )

//const uri = `mongodb+srv://asjacob:Webware25@cluster0.9xsgz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
const uri = 'mongodb+srv://asjacob:Webware25@cluster0.9xsgz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const client = new MongoClient( uri )

let collection = null

async function run() {
  console.log("Hi");
  await client.connect()
  console.log("Connected to DB");
  collection = await client.db("datatest").collection("test")
  // route to get all docs
}

app.post("/docs", async (req, res) => {
  if (collection !== null) {
    const docs = await collection.find({}).toArray()
    console.log("Docs" + docs)
    res.json( docs )
  }
})

run()

app.listen(3000)
console.log("listening on port 3000");

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

// let appdata = [
//   { 'ToDo': 'MQP prototype', 'type': 'work', 'date': "9-11-2024", 'priority': '1'},
//   { 'ToDo': 'Webware HW', 'type': 'school', 'date': "9-9-2024", 'priority': '2'},
//   { 'ToDo': 'Ask WICS Chord question', 'type': 'personal', 'date': "9-20-2024", 'priority': '3'} 
// ]

// const server = http.createServer( function( request,response ) {
//   if( request.method === 'GET' ) {
//     handleGet( request, response )    
//   }else if( request.method === 'POST' ){
//     handlePost( request, response ) 
//   }else if( request.method === 'DELETE' ){
//     handleDelete( request, response )
//   }
// })

// const handleGet = function( request, response ) {
//   const filename = dir + request.url.slice( 1 ) 

//   if( request.url === '/' ) {
//     sendFile( response, 'public/index.html' )
//   }else{
//     sendFile( response, filename )
//   }
// }

// const handlePost = function( request, response ) {
//   let dataString = ''

//   request.on( 'data', function( data ) {
//       dataString += data 
//   })

//   request.on( 'end', function() {
 
//     const parsedData = JSON.parse( dataString )
//     if ("ToDo" in parsedData) {
//       if (parsedData.type === 'work') {
//         parsedData.priority = 1;
//     } else if (parsedData.type === 'school') {
//         parsedData.priority = 2;
//     } else if (parsedData.type === 'personal') {
//         parsedData.priority = 3;
//     }
//       appdata.push(parsedData);
//       appdata.sort((a, b) => {
//         // First sort by type (work -> school -> personal)
//         const typeOrder = ['work', 'school', 'personal'];
//         if (a.type !== b.type) {
//             return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
//         }
//         // If types are the same, sort by date
//         return new Date(a.date) - new Date(b.date);
//     });

//     // Update priority to reflect the order starting from 1
//     appdata.forEach((task, index) => {
//         task.priority = index + 1;
//     });
//     }
//     console.log(appdata)

//     // ... do something with the data here!!!

//     response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
//     response.write(JSON.stringify(appdata));
//     response.end()
//   })
// }

// // Handle DELETE requests
// const handleDelete = function(request, response) {
//   let dataString = '';

//   request.on('data', function(data) {
//     dataString += data;
//   });

//   request.on('end', function() {
//     const parsedData = JSON.parse(dataString);
//     const deleteId = parsedData.id; // assuming you pass an 'id' or index to delete

//     // Remove the item from the array
//     appdata.splice(deleteId, 1);

//     // Update priorities after deletion
//     appdata.forEach((task, index) => {
//       task.priority = index + 1;
//     });

//     response.writeHead(200, "OK", {'Content-Type': 'application/json'});
//     response.write(JSON.stringify(appdata));
//     response.end();
//   });
// }

// const sendFile = function( response, filename ) {
//    const type = mime.getType( filename ) 

//    fs.readFile( filename, function( err, content ) {

//      // if the error = null, then we've loaded the file successfully
//      if( err === null ) {

//        // status code: https://httpstatuses.com
//        response.writeHeader( 200, { 'Content-Type': type })
//        response.end( content )

//      }else{

//        // file not found, error code 404
//        response.writeHeader( 404 )
//        response.end( '404 Error: File Not Found' )

//      }
//    })
// }

// server.listen( process.env.PORT || port )
