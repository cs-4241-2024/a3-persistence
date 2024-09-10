const express    = require('express'),
      app        = express(),
      dreams     = []

app.use( express.static( 'public' ) )
app.use( express.static( 'views'  ) )
app.use( express.json() )

app.post( '/submit', (req, res) => {
  dreams.push( req.body.newdream )
  res.writeHead( 200, { 'Content-Type': 'application/json' })
dreams.push( req.body )
  res.end( JSON.stringify( dreams ) )
})

const listener = app.listen( process.env.PORT )
