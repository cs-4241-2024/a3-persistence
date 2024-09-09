const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

let appdata = [
  { 'yourname': 'Bob', 'game': 'Galaga', 'score': 10000, rank: 'B'},
  { 'yourname': 'Chris', 'game': 'Pac-Man', 'score': 20000, rank: 'A'},
  { 'yourname': 'Sean', 'game': 'Burger Time', 'score': 15000, rank: 'B'} 
]

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response )
  }else if( request.method === 'DELETE' ){
    handleDelete( request, response )
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    const data = JSON.parse( dataString )

  const yourname = data.yourname
  const game = data.game
  const score = data.score
  console.log(data, yourname, game, score);
  let rank = ''
  if(Number(score) < 1000) {
    rank = 'E'
  } else if(score < 5000) {
    rank = 'D'
  } else if(score < 10000) {
    rank = 'C'
  } else if(score < 20000) {
    rank = 'B'
  } else if(score < 30000) {
    rank = 'A'
  } else {
    rank = 'S'
  }
    
    appdata.push({
      'yourname': yourname,
      'game': game,
      'score': score,
      'rank': rank
    })
    // ... do something with the data here!!!

    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    response.end(JSON.stringify(appdata))
  })
}

const handleDelete = function( request, response ) {
  let dataString = ''
  
  request.on( 'data', function( data ) {
      dataString += data 
  })
  
  request.on( 'end', function() {
  const input = JSON.parse(dataString)
  const x = appdata.findIndex(item =>
    item.yourname === input.yourname &&
    item.game === input.game &&
    item.score === input.score)

  if (x !== -1){
    appdata.splice(x, 1)
  }
      
  response.writeHead( 200, "OK", {'Content-Type': 'text/plain' }) 
  response.end(JSON.stringify(appdata))
  })
}
             

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
