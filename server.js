const express = require('express'),
      app = express()

app.use( express.static( 'public' ) )
app.use( express.static( 'views'  ) ) 
app.use( express.json() )

app.listen( process.env.PORT || 3000 )

// const middleware_post = ( req, res, next ) => {
//   let dataString = ''

//   req.on( 'data', function( data ) {
//     dataString += data 
//   })

//   req.on( 'end', function() {
//     const json = JSON.parse( dataString )
//     dreams.push( json )

//     // add a 'json' field to our request object
//     // this field will be available in any additional
//     // routes or middleware.
//     req.json = JSON.stringify( dreams )

//     // advance to next middleware or route
//     next()
//   })
// }

// app.use( middleware_post )

let appdata = {
  'table': [
    {'task': 'Webware HW', 'age': 4, 'time': 1},
  ],
}

app.get( '/api/table', ( req, res ) => {
  res.writeHead( 200, { 'Content-Type': 'application/json'})
  res.end( JSON.stringify( appdata ) )
})

app.post( '/api/saveTable', ( req, res ) => {
  appdata = req.body
  res.writeHead( 200, { 'Content-Type': 'application/json'})
  res.end( JSON.stringify( appdata ) )
})