const http = require( 'http' ),
  fs = require( 'fs' ),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library if you're testing this on your local machine.
  // However, Glitch will install it automatically by looking in your package.json
  // file.
  mime = require('mime'),
  dir = 'public/',
  port = 3000
  const appdata = [];
  const server = http.createServer( function( request, response ) {
  if ( request.method === 'GET' ) {
  handleGet( request, response );
  } else if( request.method === 'POST' ) {
  handlePost(request, response);
  }
  })
const handleGet=function( request, response ) {
  if (request.url.startsWith('/highscores')) {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const playerName= url.searchParams.get('player');
    let filteredScores=appdata;
    if (playerName){
      filteredScores =appdata.filter((record) =>record.player === playerName);
    }
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(filteredScores));
  } else if (request.url === '/') {
    sendFile(response, 'public/index.html');
  } else{
    const filename =dir + request.url.slice(1);
    sendFile(response, filename);
  }
};
const handlePost= function ( request, response ) {
  let dataString= '';
  request.on('data', function ( data ) {
    dataString += data;
  });
  request.on('end', function () {
    const receivedData = JSON.parse(dataString);
    const date =new Date().toLocaleString();
    const newRecord ={player:receivedData.yourname,clicks:receivedData.clicks,date: date,  };
    const existingRecordIndex=appdata.findIndex((record) =>record.player=== newRecord.player);
    if (existingRecordIndex !== -1) {
      if (newRecord.clicks > appdata[existingRecordIndex].clicks) {
        appdata[existingRecordIndex] = newRecord;}  } 
    else {
      appdata.push(newRecord);}
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(newRecord));
  });
};
const sendFile=function ( response, filename ) {
  const type = mime.getType( filename );
  fs.readFile(filename, function( err, content ) {
    if (err===null) {
      response.writeHeader(200,{'Content-Type': type });
      response.end(content);
    } else {
      response.writeHeader(404);
      response.end('404 Error: File Not Found');
    }
  })
}
server.listen(process.env.PORT || port);