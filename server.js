const express = require("express"),
{ MongoClient, ObjectId } = require("mongodb"),
app = express()

app.use(express.static("public") )
app.use(express.json() )

// TODO get password from .env
const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cs4241db.opedg.mongodb.net/?retryWrites=true&w=majority&appName=CS4241DB`
const client = new MongoClient( uri )

const yarn_type_to_cost = {
  "None": 0,
  "Chenille": 10,
  "Worsted Weight": 5,
  "Acrylic": 7,
  "Velvet": 15,
  "Cashmere Wool": 20,
  "Faux Fur": 12
}

const handleLogin = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })


  request.on( 'end', async function () {
    let item = JSON.parse( dataString )

    let userdata = await collection.findOne({username: item.payload.username})

    let payload = {}

    if(userdata === null) {
      payload = {login_state: false, data: 'This username does not exist, please make a new account'}
    } else {
      if(userdata.password === item.payload.password) {
        payload = {login_state: true, data: userdata.data}
      } else {
        payload = {login_state: false, data: 'This password does not match the username'}
      }
    }
    
    response.json(payload)
  })
}

const handleMakeNew = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })


  request.on( 'end', async function () {
    let item = JSON.parse( dataString )

    let userdata = await collection.findOne({username: item.payload.username})

    let payload = {}

    if(userdata === null) {
      let id = await collection.insertOne({username: item.payload.username, password: item.payload.password, data: []})
      payload = { login_state: true, data: [] }
    } else {
      payload = { login_state: false, data: 'Please choose a new username, that username is already taken' }
    }

    response.json(payload)
  })
}

const handleDelete = function( request, response ) {
  let dataString = ''
  
  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', async function() {
    
    let item = JSON.parse( dataString )
    
    let credentials = item.credentials
    let user = await collection.findOne(credentials)
    let appdata = user.data
    
    item = item.payload

    for (let existing_item of appdata) {
      if(existing_item['project_name'] == item['project_name']) {
        appdata.splice(appdata.indexOf(existing_item), 1)
        let response = await collection.updateOne(credentials, { $set: {data: appdata} })
        break
      }
    }
    
    response.json(appdata)
  })
}

const handleSubmit = function( request, response ) {
  
  let dataString = ''
  
  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', async function() {
    
    let item = JSON.parse( dataString )
    
    let credentials = item.credentials
    let user = await collection.findOne(credentials)
    let appdata = user.data
    
    item = item.payload

    item["total_cost"] = item["yarn_count"] * yarn_type_to_cost[item["yarn_type"]]
    let should_add = true
    for (let existing_item of appdata) {
      if(existing_item['project_name'] == item['project_name']) {
        appdata[appdata.indexOf(existing_item)] = item
        should_add = false
        break
      }
    }

    if(should_add) {
      appdata.push(item)
    }

    await collection.updateOne(credentials, { $set: {data: appdata} })
    
    response.json(appdata)
  })
}

let collection = null
async function run() {
  await client.connect()
  collection = await client.db("a3-persistance").collection("client_info")  
  
  app.post("/submit", async (req, res) => {
    handleSubmit(req, res)
  })
  
  app.post("/delete", async (req, res) => {
    handleDelete(req, res)
  })
  
  app.post("/login", async (req, res) => {
    handleLogin(req, res)
  })
  
  app.post("/make-new", async (req, res) => {
    handleMakeNew(req, res)
  })
}

run()

app.listen(3000)
