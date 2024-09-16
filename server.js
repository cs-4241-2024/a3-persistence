const express = require('express'),
      app = express()

app.use( express.static( 'public' ) )
app.use( express.static( 'views'  ) ) 
app.use( express.json() )

let appdata = {
  'table': [
    {'task': 'Webware HW', 'age': '4', 'time': '1'},
  ],
}

app.get( '/api/table', ( req, res ) => {
  res.json(appdata)
})

app.post( '/api/saveTable', ( req, res ) => {
  appdata = req.body
  console.log( req.body )
  res.json(appdata)
})

app.listen( process.env.PORT || 3000 )