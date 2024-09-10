//Expres Server
const express = require( 'express' ),
      app = express()

app.use(express.static('views'))
app.use(express.static('public'))
app.use(express.json())


const appdata = [
  { name: 'Jeremy', clickCount: 10, points: 1000 },
]

app.get('/getData', (req, res) => {
  res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
  res.end(JSON.stringify(appdata))
})

app.post('/submit', (req, res) => {
  let dataString = ''

  req.on( 'data', function( data ) {
    dataString += data
  })

  req.on( 'end', function() {
    const json = JSON.parse( dataString )
    let score = json.clickCount*100



    // add a 'json' field to our request object
    // this field will be available in any additional
    // routes or middleware.
    appdata.push( {name: json.name, clickCount: json.clickCount, points: score }  )

    res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    res.end(JSON.stringify(appdata))
  })
})




app.delete('/deleteRow', (req, res) => {
  let dataString = ''

  req.on( 'data', function( data ) {
    dataString += data
  })

  req.on( 'end', function() {
    const json = JSON.parse( dataString )
    let index = json.index

    appdata.splice(index, 1)

    // add a 'json' field to our request object
    // this field will be available in any additional
    // routes or middleware.

    res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    res.end(JSON.stringify(appdata))
  })
})

app.put('/alterRow', (req, res) => {
  console.log("this is body:",req.body)
  const json = req.body
  let index = Number(json.index)
  console.log("This is index",index)
  const targetObject = appdata.find( (row, i) => i === index )
  console.log("this is target:",targetObject)
  targetObject.name = json.name
  targetObject.clickCount = json.clickCount
  targetObject.points = json.clickCount*100

  // add a 'json' field to our request object
  // this field will be available in any additional
  // routes or middleware.

  res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
  res.end(JSON.stringify(appdata))
})

app.listen( process.env.PORT || 3000 )
