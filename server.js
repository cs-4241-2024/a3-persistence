const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const appdata = [
  { 'username': 'Ananya', 'show title': "Jujutsu Kaisen", 'last ep watched': 12, 'date logged': '9/9/2024' },
]

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  } else if( request.method === 'DELETE') {
    handleDelete(request, response);
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  } else if (request.url === '/appdata') {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(appdata));
  } else {
    sendFile( response, filename )
  } 
} 

const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    const formData = JSON.parse(dataString);

    const newEntry = {
      'username': formData.username,
      'show title': formData.showName,
      'last ep watched': Number(formData.lastViewed),
      'date logged': getDate()
    };

    appdata.push(newEntry);

    console.log(appdata);

    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    response.end(JSON.stringify( appdata ));
  })
}

const handleDelete = function(request, response) {
  let dataString = '';

  request.on('data', function(data) {
    dataString += data;
  });

  request.on('end', function() {
    const formData = JSON.parse(dataString);
    const { username, showTitle } = formData;

    //filter out the entry that matches the username and show title
    const newAppData = appdata.filter(entry =>
      !(entry.username === username && entry['show title'] === showTitle)
    );

    appdata.length = 0; //clears the old data
    appdata.push(...newAppData); 

    response.writeHead(200, "OK", {'Content-Type': 'application/json'});
    response.end(JSON.stringify(appdata));
  });
}

function getDate() {
  const date = new Date();

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     } else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}

server.listen( process.env.PORT || port )
