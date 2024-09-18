require('dotenv').config()

const path = require('path')

let user = ''
let pass = ''

const express = require('express'),
      { MongoClient, ObjectID } = require("mongodb"),
      app = express()

const logger = (req,res,next) => {
        console.log( 'url:', req.url )
        next()
      }

const middleware_post = (req, res, next ) => {
  let dataString = ''

  req.on( 'data', function( data ) {
    dataString += data
  })

  req.on( 'end', function() {
    req.data = dataString
    if (dataString != '') {
      req.json = JSON.parse(dataString)
    }
    next()
  })
}

const lvl1 = [
  { 'level': "Wizard Level:", 'available': 1},
  { 'level': "Level", 'available': "Total", 'used': "Used", 'remaining': "Remaining"},
  { 'level': 1, 'available': 2, 'used': 0, 'remaining': 2},
  { 'level': 2, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 3, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 4, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 5, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 6, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 7, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 8, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 9, 'available': 0, 'used': 0, 'remaining': 0}
]

const lvl2 = [
  { 'level': "Wizard Level:", 'available': 2},
  { 'level': "Level", 'available': "Total", 'used': "Used", 'remaining': "Remaining"},
  { 'level': 1, 'available': 3, 'used': 0, 'remaining': 3},
  { 'level': 2, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 3, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 4, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 5, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 6, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 7, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 8, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 9, 'available': 0, 'used': 0, 'remaining': 0}
]

const lvl3 = [
  { 'level': "Wizard Level:", 'available': 3},
  { 'level': "Level", 'available': "Total", 'used': "Used", 'remaining': "Remaining"},
  { 'level': 1, 'available': 4, 'used': 0, 'remaining': 3},
  { 'level': 2, 'available': 2, 'used': 0, 'remaining': 0},
  { 'level': 3, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 4, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 5, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 6, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 7, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 8, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 9, 'available': 0, 'used': 0, 'remaining': 0}
]

const lvl4 = [
  { 'level': "Wizard Level:", 'available': 4},
  { 'level': "Level", 'available': "Total", 'used': "Used", 'remaining': "Remaining"},
  { 'level': 1, 'available': 4, 'used': 0, 'remaining': 3},
  { 'level': 2, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 3, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 4, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 5, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 6, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 7, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 8, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 9, 'available': 0, 'used': 0, 'remaining': 0}
]

const lvl5 = [
  { 'level': "Wizard Level:", 'available': 5},
  { 'level': "Level", 'available': "Total", 'used': "Used", 'remaining': "Remaining"},
  { 'level': 1, 'available': 4, 'used': 0, 'remaining': 3},
  { 'level': 2, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 3, 'available': 2, 'used': 0, 'remaining': 0},
  { 'level': 4, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 5, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 6, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 7, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 8, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 9, 'available': 0, 'used': 0, 'remaining': 0}
]

const lvl6 = [
  { 'level': "Wizard Level:", 'available': 6},
  { 'level': "Level", 'available': "Total", 'used': "Used", 'remaining': "Remaining"},
  { 'level': 1, 'available': 4, 'used': 0, 'remaining': 3},
  { 'level': 2, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 3, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 4, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 5, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 6, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 7, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 8, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 9, 'available': 0, 'used': 0, 'remaining': 0}
]

const lvl7 = [
  { 'level': "Wizard Level:", 'available': 7},
  { 'level': "Level", 'available': "Total", 'used': "Used", 'remaining': "Remaining"},
  { 'level': 1, 'available': 4, 'used': 0, 'remaining': 3},
  { 'level': 2, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 3, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 4, 'available': 1, 'used': 0, 'remaining': 0},
  { 'level': 5, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 6, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 7, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 8, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 9, 'available': 0, 'used': 0, 'remaining': 0}
]

const lvl8 = [
  { 'level': "Wizard Level:", 'available': 8},
  { 'level': "Level", 'available': "Total", 'used': "Used", 'remaining': "Remaining"},
  { 'level': 1, 'available': 4, 'used': 0, 'remaining': 3},
  { 'level': 2, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 3, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 4, 'available': 2, 'used': 0, 'remaining': 0},
  { 'level': 5, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 6, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 7, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 8, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 9, 'available': 0, 'used': 0, 'remaining': 0}
]

const lvl9 = [
  { 'level': "Wizard Level:", 'available': 9},
  { 'level': "Level", 'available': "Total", 'used': "Used", 'remaining': "Remaining"},
  { 'level': 1, 'available': 4, 'used': 0, 'remaining': 3},
  { 'level': 2, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 3, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 4, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 5, 'available': 1, 'used': 0, 'remaining': 0},
  { 'level': 6, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 7, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 8, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 9, 'available': 0, 'used': 0, 'remaining': 0}
]

const lvl10 = [
  { 'level': "Wizard Level:", 'available': 10},
  { 'level': "Level", 'available': "Total", 'used': "Used", 'remaining': "Remaining"},
  { 'level': 1, 'available': 4, 'used': 0, 'remaining': 3},
  { 'level': 2, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 3, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 4, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 5, 'available': 2, 'used': 0, 'remaining': 0},
  { 'level': 6, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 7, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 8, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 9, 'available': 0, 'used': 0, 'remaining': 0}
]

const lvl11 = [
  { 'level': "Wizard Level:", 'available': 11},
  { 'level': "Level", 'available': "Total", 'used': "Used", 'remaining': "Remaining"},
  { 'level': 1, 'available': 4, 'used': 0, 'remaining': 3},
  { 'level': 2, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 3, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 4, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 5, 'available': 2, 'used': 0, 'remaining': 0},
  { 'level': 6, 'available': 1, 'used': 0, 'remaining': 0},
  { 'level': 7, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 8, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 9, 'available': 0, 'used': 0, 'remaining': 0}
]

const lvl12 = [
  { 'level': "Wizard Level:", 'available': 12},
  { 'level': "Level", 'available': "Total", 'used': "Used", 'remaining': "Remaining"},
  { 'level': 1, 'available': 4, 'used': 0, 'remaining': 3},
  { 'level': 2, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 3, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 4, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 5, 'available': 2, 'used': 0, 'remaining': 0},
  { 'level': 6, 'available': 1, 'used': 0, 'remaining': 0},
  { 'level': 7, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 8, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 9, 'available': 0, 'used': 0, 'remaining': 0}
]

const lvl13 = [
  { 'level': "Wizard Level:", 'available': 13},
  { 'level': "Level", 'available': "Total", 'used': "Used", 'remaining': "Remaining"},
  { 'level': 1, 'available': 4, 'used': 0, 'remaining': 3},
  { 'level': 2, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 3, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 4, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 5, 'available': 2, 'used': 0, 'remaining': 0},
  { 'level': 6, 'available': 1, 'used': 0, 'remaining': 0},
  { 'level': 7, 'available': 1, 'used': 0, 'remaining': 0},
  { 'level': 8, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 9, 'available': 0, 'used': 0, 'remaining': 0}
]

const lvl14 = [
  { 'level': "Wizard Level:", 'available': 14},
  { 'level': "Level", 'available': "Total", 'used': "Used", 'remaining': "Remaining"},
  { 'level': 1, 'available': 4, 'used': 0, 'remaining': 3},
  { 'level': 2, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 3, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 4, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 5, 'available': 2, 'used': 0, 'remaining': 0},
  { 'level': 6, 'available': 1, 'used': 0, 'remaining': 0},
  { 'level': 7, 'available': 1, 'used': 0, 'remaining': 0},
  { 'level': 8, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 9, 'available': 0, 'used': 0, 'remaining': 0}
]

const lvl15 = [
  { 'level': "Wizard Level:", 'available': 15},
  { 'level': "Level", 'available': "Total", 'used': "Used", 'remaining': "Remaining"},
  { 'level': 1, 'available': 4, 'used': 0, 'remaining': 3},
  { 'level': 2, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 3, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 4, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 5, 'available': 2, 'used': 0, 'remaining': 0},
  { 'level': 6, 'available': 1, 'used': 0, 'remaining': 0},
  { 'level': 7, 'available': 1, 'used': 0, 'remaining': 0},
  { 'level': 8, 'available': 1, 'used': 0, 'remaining': 0},
  { 'level': 9, 'available': 0, 'used': 0, 'remaining': 0}
]

const lvl16 = [
  { 'level': "Wizard Level:", 'available': 16},
  { 'level': "Level", 'available': "Total", 'used': "Used", 'remaining': "Remaining"},
  { 'level': 1, 'available': 4, 'used': 0, 'remaining': 3},
  { 'level': 2, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 3, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 4, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 5, 'available': 2, 'used': 0, 'remaining': 0},
  { 'level': 6, 'available': 1, 'used': 0, 'remaining': 0},
  { 'level': 7, 'available': 1, 'used': 0, 'remaining': 0},
  { 'level': 8, 'available': 1, 'used': 0, 'remaining': 0},
  { 'level': 9, 'available': 0, 'used': 0, 'remaining': 0}
]

const lvl17 = [
  { 'level': "Wizard Level:", 'available': 17},
  { 'level': "Level", 'available': "Total", 'used': "Used", 'remaining': "Remaining"},
  { 'level': 1, 'available': 4, 'used': 0, 'remaining': 3},
  { 'level': 2, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 3, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 4, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 5, 'available': 2, 'used': 0, 'remaining': 0},
  { 'level': 6, 'available': 1, 'used': 0, 'remaining': 0},
  { 'level': 7, 'available': 1, 'used': 0, 'remaining': 0},
  { 'level': 8, 'available': 1, 'used': 0, 'remaining': 0},
  { 'level': 9, 'available': 1, 'used': 0, 'remaining': 0}
]

const lvl18 = [
  { 'level': "Wizard Level:", 'available': 18},
  { 'level': "Level", 'available': "Total", 'used': "Used", 'remaining': "Remaining"},
  { 'level': 1, 'available': 4, 'used': 0, 'remaining': 3},
  { 'level': 2, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 3, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 4, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 5, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 6, 'available': 1, 'used': 0, 'remaining': 0},
  { 'level': 7, 'available': 1, 'used': 0, 'remaining': 0},
  { 'level': 8, 'available': 1, 'used': 0, 'remaining': 0},
  { 'level': 9, 'available': 1, 'used': 0, 'remaining': 0}
]

const lvl19 = [
  { 'level': "Wizard Level:", 'available': 19},
  { 'level': "Level", 'available': "Total", 'used': "Used", 'remaining': "Remaining"},
  { 'level': 1, 'available': 4, 'used': 0, 'remaining': 3},
  { 'level': 2, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 3, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 4, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 5, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 6, 'available': 2, 'used': 0, 'remaining': 0},
  { 'level': 7, 'available': 1, 'used': 0, 'remaining': 0},
  { 'level': 8, 'available': 1, 'used': 0, 'remaining': 0},
  { 'level': 9, 'available': 1, 'used': 0, 'remaining': 0}
]

const lvl20 = [
  { 'level': "Wizard Level:", 'available': 20},
  { 'level': "Level", 'available': "Total", 'used': "Used", 'remaining': "Remaining"},
  { 'level': 1, 'available': 4, 'used': 0, 'remaining': 3},
  { 'level': 2, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 3, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 4, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 5, 'available': 3, 'used': 0, 'remaining': 0},
  { 'level': 6, 'available': 2, 'used': 0, 'remaining': 0},
  { 'level': 7, 'available': 2, 'used': 0, 'remaining': 0},
  { 'level': 8, 'available': 1, 'used': 0, 'remaining': 0},
  { 'level': 9, 'available': 1, 'used': 0, 'remaining': 0}
]

const resetfnc = function(level) {

  switch (level) {
    case 1:
      appdata = JSON.parse(JSON.stringify(lvl1))
      break
    case 2:
      appdata = JSON.parse(JSON.stringify(lvl2))
      break
    case 3:
      appdata = JSON.parse(JSON.stringify(lvl3))
      break
    case 4:
      appdata = JSON.parse(JSON.stringify(lvl4))
      break
    case 5:
      appdata = JSON.parse(JSON.stringify(lvl5))
      break
    case 6:
      appdata = JSON.parse(JSON.stringify(lvl6))
      break
    case 7:
      appdata = JSON.parse(JSON.stringify(lvl7))
      break
    case 8:
      appdata = JSON.parse(JSON.stringify(lvl8))
      break
    case 9:
      appdata = JSON.parse(JSON.stringify(lvl9))
      break
    case 10:
      appdata = JSON.parse(JSON.stringify(lvl10))
      break
    case 11:
      appdata = JSON.parse(JSON.stringify(lvl11))
      break
    case 12:
      appdata = JSON.parse(JSON.stringify(lvl12))
      break
    case 13:
      appdata = JSON.parse(JSON.stringify(lvl13))
      break
    case 14:
      appdata = JSON.parse(JSON.stringify(lvl14))
      break
    case 15:
      appdata = JSON.parse(JSON.stringify(lvl15))
      break
    case 16:
      appdata = JSON.parse(JSON.stringify(lvl16))
      break
    case 17:
      appdata = JSON.parse(JSON.stringify(lvl17))
      break
    case 18:
      appdata = JSON.parse(JSON.stringify(lvl18))
      break
    case 19:
      appdata = JSON.parse(JSON.stringify(lvl19))
      break
    case 20:
      appdata = JSON.parse(JSON.stringify(lvl20))
      break
    default:
      console.log("Something went wrong with the reset.")
  }
  
}

let appdata = [
  { 'level': "Wizard Level:", 'available': 1},
  { 'level': "Level", 'available': "Total", 'used': "Used", 'remaining': "Remaining"},
  { 'level': 1, 'available': 2, 'used': 0, 'remaining': 2},
  { 'level': 2, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 3, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 4, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 5, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 6, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 7, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 8, 'available': 0, 'used': 0, 'remaining': 0},
  { 'level': 9, 'available': 0, 'used': 0, 'remaining': 0}
]

let userdata = [
  {'username': "", 'password': ""}
]

app.use(logger)

app.use( middleware_post )

app.use( express.static(path.join(__dirname, 'public') ))

const uri = `${process.env.MongoStart}${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient( uri )

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("UserData").collection("SpellSlotTracker")

  // route to get all docs
  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json( docs )
    }
  })
}

app.use( (req,res,next) => {
  //checks for connection to database
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

run()

app.use( express.json() )

app.post( '/login', (req, res ) => {
  user = req.json.username
  pass = req.json.password
  console.log(user + " and " + pass)
  console.log(__dirname)
  res.sendFile(path.join(__dirname, 'public', 'wizard.html'))
  
  /*res.writeHead( 200, "OK", {'Content-Type': 'text' })
  res.end(JSON.stringify({username: user, password: pass}))*/
})

app.post( '/submit', (req, res ) => {
  console.log(req.data + " with a /submit")

  resetfnc(req.json.payload)
  res.writeHead( 200, "OK", {'Content-Type': 'text' })
  res.end(JSON.stringify({lvl: req.json.payload}))
})

app.post( '/loadTable', (req, res ) => {

  if (req.json.payload > 1) {
    let datarow = appdata[req.json.payload]
    datarow.remaining = datarow.available - datarow.used
    }
    res.writeHead( 200, "OK", {'Content-Type': 'text' })
    res.end(JSON.stringify(appdata[req.json.payload]))
})

app.post( '/longRest', (req, res ) => {
  let level = appdata[0].available
  
  resetfnc(level)
  res.writeHead( 200, "OK", {'Content-Type': 'text' })
  res.end(JSON.stringify({lvl: level}))
})

app.post( '/useSpell', (req, res ) => {
  let datarow = appdata[req.json.payload]
      if (datarow.remaining > 0) {
        datarow.used += 1
        datarow.remaining = datarow.available - datarow.used
      }
      res.writeHead( 200, "OK", {'Content-Type': 'text' })
      res.end(JSON.stringify({lvl: (req.json.payload)}))
})

app.post( '/regainSpell', (req, res ) => {

  let datarow = appdata[req.json.payload]
  if (datarow.remaining < datarow.available) {
    datarow.used -= 1
    datarow.remaining = datarow.available - datarow.used
  }
  res.writeHead( 200, "OK", {'Content-Type': 'text' })
  res.end(JSON.stringify({lvl: (req.json.payload)}))

})

const listener = app.listen(process.env.PORT || 3000)