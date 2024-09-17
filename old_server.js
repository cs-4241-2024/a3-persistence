const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const appdata = []

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  }
})

//Handles all get request
const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }else{
    sendFile( response, filename )
  }
}


// Handles all POST requests
const handlePost = function(request, response) {
  console.log('Post request made');
  
  let dataString = '';

  request.on('data', function(data) {
    dataString += data;
  });

  request.on('end', function() {
    console.log('Data string: ' + dataString);
    
    let parsed = JSON.parse(dataString);
    parsed.total = parsed.sets * parsed.reps;
    console.log('Parsed data: ', parsed);

    switch (request.url) {
      case '/submit':
        appdata.push(parsed);
        response.writeHead(200, "OK", { 'Content-Type': 'text/plain' });
        response.end(JSON.stringify({ data: appdata }));
        break;

      case '/clear':
        appdata.length = 0;
        response.writeHead(200, "OK", { 'Content-Type': 'text/plain' });
        response.end(JSON.stringify({ data: appdata }));
        break;

      case '/delete':
        console.log('Index to delete: ' + parsed.index);
        appdata.splice(parsed.index, 1);
        response.writeHead(200, "OK", { 'Content-Type': 'text/plain' });
        response.end(JSON.stringify({ data: appdata }));
        break;
      case '/onLoad':
        response.writeHead(200, "OK", { 'Content-Type': 'text/plain' });
        response.end(JSON.stringify({data: appdata}));
        break;
      default:
        response.writeHead(404, "BAD", { 'Content-Type': 'text/plain' });
        response.end();
        break;
    }
  });
};


const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}

server.listen( process.env.PORT || port )
