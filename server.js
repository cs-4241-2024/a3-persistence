const express = require('express'),
    app = express(),
    cookiedata = []

app.use(express.static('views'))
app.use(express.static('public'))
app.use(express.json())

app.post('/submit', (req, res) => {
    res.writeHead(200, {'Content-Type': 'application/json'})
    cookiedata.push(req.body)
    res.end(JSON.stringify(cookiedata))
})

app.list(process.env.PORT)

const listener = app.listen (process.env.PORT || 3000)



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin:<db_password>@cluster0.5idai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);






// const http = require( 'http' ),
//     fs   = require( 'fs' ),
//     // IMPORTANT: you must run `npm install` in the directory for this assignment
//     // to install the mime library if you're testing this on your local machine.
//     // However, Glitch will install it automatically by looking in your package.json
//     // file.
//     mime = require( 'mime' ),
//     dir  = 'public/',
//     port = 3000
//
// let appdata =  [
//     { 'name': 'Piper', 'cookie':'chocolate chip', 'icecream': 'vanilla', 'other':'', 'cake':'vanilla cake'},
//     { 'name': 'James', 'cookie':'oatmeal no raisin', 'icecream': 'chocolate', 'other':'', 'cake':'chocolate cake'},
//     { 'name': 'Sky', 'cookie':'sugar', 'icecream': 'vanilla', 'other':'', 'cake':'vanilla cake'}
// ]
//
// const server = http.createServer( function (request, response ) {
//     if( request.method === 'GET' ) {
//         handleGet( request, response )
//     }else if( request.method === 'POST' ){
//         handlePost( request, response )
//     }
// })
//
//
// const handleGet = function( request, response ) {
//     const filename = dir + request.url.slice( 1 )
//     if( request.url === '/' ) {
//         sendFile( response, 'public/index.html' )
//     }else if (request.url === '/data'){
//         response.end(JSON.stringify(appdata))
//     }
//     else{
//         sendFile( response, filename )
//     }
// }
//
// const handlePost = function( request, response ) {
//     let dataString = ''
//
//     //console.log(appdata)
//     request.on( 'data', function( data ) {
//         console.log(data)
//         dataString += data
//     })
//     request.on( 'end', function() {
//         //console.log( JSON.parse( dataString ) )
//         const data = JSON.parse(dataString)
//         const tempDict = {'name':data[0], 'cookie':data[1], 'icecream':data[2], 'other':data[3], 'cake':data[4]}
//         appdata = appdata.concat(tempDict)
//         //appdata.push(tempDict)
//
//         //const data = JSON.parse( dataString )
//         // ... do something with the data here!!!
//         //appdata.push(response)
//         //appdata.push(data)
//         //appdata = appdata + response
//
//         response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
//         response.end(JSON.stringify(data))
//     })
// }
//
// const sendFile = function( response, filename ) {
//     const type = mime.getType( filename )
//
//     fs.readFile( filename, function( err, content ) {
//
//         // if the error = null, then we've loaded the file successfully
//         if( err === null ) {
//
//             // status code: https://httpstatuses.com
//             response.writeHeader( 200, { 'Content-Type': type })
//             response.end( content )
//
//         }else{
//
//             // file not found, error code 404
//             response.writeHeader( 404 )
//             response.end( '404 Error: File Not Found' )
//
//         }
//     })
// }
//
// server.listen( process.env.PORT || port )