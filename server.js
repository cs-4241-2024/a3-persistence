const express = require( 'express' ),
      app = express()

app.use( express.static( 'public' ) )
app.use( express.static( 'views'  ) )
app.use( express.json() )

app.post( '/submit', express.json(), (req, res) => {

  values = req.body
  let result = -0
  switch(values.operator) {
    case 'addition':
      result = Number(values.firstvalue) + Number(values.secondvalue)
      break
    case 'subtraction':
      result = Number(values.firstvalue) - Number(values.secondvalue)
      break
    case 'multiplication':
      result = Number(values.firstvalue) * Number(values.secondvalue)
      break
    case 'division':
      result = Number(values.firstvalue) / Number(values.secondvalue)
      break
  }

  res.writeHead( 200, { 'Content-Type': 'application/json' })
  res.end( JSON.stringify( result ) )
})

app.listen( process.env.PORT || 3000 )