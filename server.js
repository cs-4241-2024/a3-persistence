const express = require('express'),
      app = express()

app.use( express.static('views') )
app.use( express.static('public') )
app.use( express.json() )

const listener = app.listen( process.env.PORT || 3000 )

let appdata = [
  { 'yourname': 'Bob', 'game': 'Galaga', 'score': 10000, rank: 'B'},
  { 'yourname': 'Chris', 'game': 'Pac-Man', 'score': 20000, rank: 'A'},
  { 'yourname': 'Sean', 'game': 'Burger Time', 'score': 15000, rank: 'B'} 
]

app.post( '/submit', ( request, response ) => {
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

    response.writeHead( 200, { 'Content-Type': 'application/json'})
    response.end(JSON.stringify(appdata))
  })
})

app.post( '/delete', ( request, response ) => {
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
      
  response.writeHead( 200, { 'Content-Type': 'application/json'}) 
  response.end(JSON.stringify(appdata))
  })
})

app.post( '/modify', ( request, response ) => {
  let dataString = ''
  
  request.on( 'data', function( data ) {
      dataString += data 
  })
  
  request.on( 'end', function() {
  const input = JSON.parse(dataString)
  const x = appdata.findIndex(item =>
    item.yourname === input.yourname1 &&
    item.game === input.game1 &&
    item.score === input.score1)
  console.log(x)

  if (x !== -1){
    appdata.splice(x, 1)
    const data = JSON.parse( dataString )
    const yourname = data.yourname2
    const game = data.game2
    const score = data.score2
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
  }
      
  response.writeHead( 200, { 'Content-Type': 'application/json'}) 
  response.end(JSON.stringify(appdata))
  })
})
