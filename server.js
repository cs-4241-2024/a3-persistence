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
  { 'id':1,'rPPR': 2, 'rDyn': 2, 'rDelta': 0, "name": "CeeDee Lamb","team": "DAL", "pos" : "WR", "byeWeek" : 7, "age": 25 },
  { 'id':2,'rPPR': 3, 'rDyn': 15, 'rDelta': -12, "name": "Tyreek Hill","team": "MIA", "pos" : "WR", "byeWeek" : 6, "age": 30 },
  { 'id':3,'rPPR': 1, 'rDyn': 13, 'rDelta': -12, "name": "Christian McCaffrey","team": "SF", "pos" : "RB", "byeWeek" : 9, "age": 28 }
]
let nextIdNumber = 4

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }
  else if (request.url === '/FFtable') {
    sendFFData(response)
  }
  else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  if( request.url === '/submit' ) {
    handleNewPlayer( request, response )
  }
  else if (request.url === '/delete') {
    deletePlayer(request, response)
  }
  else if (request.url === '/edit') {
    editRecord(request, response)
  }
  else if (request.url === '/record'){
    getRecord(request, response)
  }
}

function handleNewPlayer( request, response ){
  let dataString = ''

  request.on( 'data', function( data ) {
    dataString += data
  })

  request.on( 'end', function() {
    // console.log( JSON.parse( dataString ) )

    let newRecord = JSON.parse( dataString )

    //check if record is valid if so add it
    if (recordIsVaild(newRecord)) {
      //calculate rDelta for newRecord
      newRecord["rDelta"] = newRecord["rPPR"]-newRecord["rDyn"]
      newRecord["id"] = nextIdNumber
      nextIdNumber++
      appdata.push(newRecord)
      response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
      response.end('good')
    }
    else{
      response.writeHead( 400, "BAD REQUEST", {'Content-Type': 'text/plain' })
      response.end('bad request')
    }

  })
}

function deletePlayer(request, response){
  let dataString = ''

  request.on( 'data', function( data ) {
    dataString += data
  })

  request.on( 'end', function() {
    let idToDelete = parseInt(JSON.parse(dataString)['id'])

    // find player with sent id and delete
    let found = false
    for (let i =0; i<appdata.length;i++){
      if(appdata[i]['id']===idToDelete){
        appdata.splice(i,1)
        found = true
        break
      }
    }
    //send back successes if player was deleted
    if (found){
      response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
      response.end('good')
    }
    else{
      response.writeHead( 400, "BAD REQUEST", {'Content-Type': 'text/plain' })
      response.end('not found')
    }

  })
}

//make sure all fields are included
function recordIsVaild(newRecord){
  if(newRecord['rDyn']==null ){
    return false
  }
  if(newRecord['rPPR']==null ){
    return false
  }
  if(newRecord['name']==null || newRecord['name']===""){
    return false
  }
  if(newRecord['team']==null || newRecord['team']===""){
    return false
  }
  if(newRecord['pos']==null || newRecord['pos']===""){
    return false
  }
  if(newRecord['byeWeek']==null ){
    return false
  }
  if(newRecord['age']==null ){
    return false
  }
  return true

}

function getRecord(request,response){
  let dataString = ''

  request.on( 'data', function( data ) {
    dataString += data
  })

  request.on( 'end', function() {
      let index = parseInt(JSON.parse(dataString)['index'])
      if(!isNaN(index)){
        let record = appdata[index]
        const type = mime.getType( JSON.stringify(record) )
        response.writeHeader( 200, { 'Content-Type': type })
        response.end( JSON.stringify(record) )
      }
      else{
        response.writeHeader( 404 )
        response.end( 'Index not found in dataset' )
      }
  })
}

function editRecord(request,response){
  let dataString = ''

  request.on( 'data', function( data ) {
    dataString += data
  })

  request.on( 'end', function() {
    let message = JSON.parse(dataString)
    let index = parseInt(JSON.parse(message['index']))
    let editedRecord = JSON.parse( message["editedRecord"])
    if(!isNaN(index)){
      let record = appdata[index]
      record["rDyn"] = editedRecord["rDyn"]
      record["rPPR"] = editedRecord["rPPR"]
      record["rDelta"] = editedRecord["rDelta"]
      record["name"] = editedRecord["name"]
      record["team"] = editedRecord["team"]
      record["pos"] = editedRecord["pos"]
      record["byeWeek"] = editedRecord["byeWeek"]
      record["age"] = editedRecord["age"]

      response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
      response.end('good')
    }
    else{
      response.writeHeader( 404 )
      response.end( 'edit index bad' )
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

function sendFFData(response){
  let FFdata = JSON.stringify(appdata)
  const type = mime.getType( JSON.stringify(appdata) )
  response.writeHeader( 200, { 'Content-Type': type })
  response.end( JSON.stringify(appdata) )

}

server.listen( process.env.PORT || port )
