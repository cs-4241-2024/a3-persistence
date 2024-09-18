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
  { task: 'Complete assignment', priority: 1, created_at: '2024-09-08', deadline: '2024-09-09' },
  { task: 'Buy groceries', priority: 2, created_at: '2024-09-08', deadline: '2024-09-10' }
]

function computeDeadline(task) {
  const creationDate = new Date(task.created_at);
  let daysToAdd = 1; // Default is 1 day for highest priority

  // More days for lower priority tasks
  if (task.priority === 2) {
    daysToAdd = 2;
  } else if (task.priority === 3) {
    daysToAdd = 3;
  }

  creationDate.setDate(creationDate.getDate() + daysToAdd);
  task.deadline = creationDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
}

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
  else
  {
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    
    const parsedData = JSON.parse(dataString);

    if (parsedData.action === 'add') 
    {
      // Add new task and compute derived deadline
      parsedData.created_at = new Date().toISOString().split('T')[0]; // Set current date
      computeDeadline(parsedData);
      appdata.push(parsedData);
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ status: 'success', appdata }));
    } 
    else if (parsedData.action === 'delete') 
    {
      // Delete task by task description
      appdata = appdata.filter(item => item.task !== parsedData.task);
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ status: 'deleted', appdata }));
    } 
    else if (parsedData.action === 'get') 
    {
      // Return the task list when requested
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(appdata));
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
