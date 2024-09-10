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
  { name: 'Jeremy', clickCount: 10, points: 1000 },
]

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )
  }else if( request.method === 'POST' ){
    handlePost( request, response )
  }else if (request.method === 'DELETE'){
    handleDelete( request, response )
  }else if (request.method === 'PATCH'){
    handlePatch( request, response)
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 )

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }
  else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ''
  if( request.url === '/getData'){
    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    response.end(JSON.stringify(appdata))
  }
  else{
    request.on( 'data', function( data ) {
      dataString += data
    })

    request.on( 'end', function() {
      console.log(dataString)
      const parsedData = JSON.parse( dataString )

      let score = parsedData.clickCount*100

      // console.log(score )

      //Store Data
      appdata.push({name: parsedData.name, clickCount: parsedData.clickCount, points: score })

      console.log(appdata)


      response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
      response.end(JSON.stringify(appdata))
    })
  }
}

const handleDelete = function( request, response ) {
  let dataString = ''
  request.on( 'data', function( data ) {
    dataString += data
  })

  request.on( 'end', function() {
    console.log(dataString)
    const parsedData = JSON.parse( dataString )

    let index = parsedData.index

    if( request.url === '/deleteRow'){
      appdata.splice(index, 1)
      response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
      response.end(JSON.stringify(appdata))
    }
    else{
      response.writeHead( 404)
      response.end( '404 Error: No delete valid request found' )
    }

  })
}

const handlePatch = function( request, response ) {
  let dataString = ''
  request.on( 'data', function( data ) {
    dataString += data
  })

  request.on( 'end', function() {
    console.log(dataString)
    const parsedData = JSON.parse( dataString )

    let index = Number(parsedData.index)

    if( request.url === '/alterRow'){
      console.log(index)
      const targetObject = appdata.find( (row, i) => i === index )
      console.log(targetObject)
      targetObject.name = parsedData.name
      targetObject.clickCount = parsedData.clickCount
      targetObject.points = parsedData.clickCount*100
      response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
      response.end(JSON.stringify(appdata))
    }
    else{
      response.writeHead( 404)
      response.end( '404 Error: No delete valid request found' )
    }

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
