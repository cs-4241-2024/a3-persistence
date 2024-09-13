require('dotenv').config()

// Mongo DB
const { MongoClient, ObjectId } = require('mongodb');
//Expres Server
const express = require( 'express' ),
    app = express()

app.use(express.static('views'))
app.use(express.static('public'))
app.use(express.json())

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient( uri )

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("datatest").collection("test")


}

run()
// route to get all docs
app.get("/docs", async (req, res) => {
  if (collection !== null) {
    const docs = await collection.find({}).toArray()
    res.json( docs )
  }
})

app.post( '/add', async (req,res) => {
  const result = await collection.insertOne( req.body )
  res.json( result )
})

// assumes req.body takes form { _id:5d91fb30f3f81b282d7be0dd } etc.
app.post( '/remove', async (req,res) => {
  const result = await collection.deleteOne({
    _id:new ObjectId( req.body._id )
  })

  res.json( result )
})

app.post( '/update', async (req,res) => {
  const result = await collection.updateOne(
      { _id: new ObjectId( req.body._id ) },
      { $set:{ name:req.body.name } }
  )

  res.json( result )
})





const appdata = [
  { name: 'Jeremy', clickCount: 10, points: 1000 },
]

app.get('/getData', (req, res) => {
  res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
  res.end(JSON.stringify(appdata))
})

app.post('/submit', async (req, res) => {
  const json = req.body
  console.log(json)
  let score = json.clickCount*100



  // add a 'json' field to our request object
  // this field will be available in any additional
  // routes or middleware.
  appdata.push( {name: json.name, clickCount: json.clickCount, points: score }  )

  const result = await collection.insertOne( {name: json.name, clickCount: json.clickCount, points: score } )
  res.json( result )

  // res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
  // res.end(JSON.stringify(appdata))
})




app.delete('/deleteRow', async (req, res) => {
  const json = req.body
  console.log(json)
  let index = Number(json.index)

  appdata.splice(index, 1)

  const result = await collection.deleteOne({
    _id:new ObjectId( req.body._id )
  })

  res.json( result )

  // add a 'json' field to our request object
  // this field will be available in any additional
  // routes or middleware.

  res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
  res.end(JSON.stringify(appdata))
})

app.put('/alterRow', async (req, res) => {

  const json = req.body
  console.log(json)
  let index = Number(json.index)

  const targetObject = appdata.find( (row, i) => i === index )

  targetObject.name = json.name
  targetObject.clickCount = json.clickCount
  targetObject.points = json.clickCount*100

  const result = await collection.updateOne(
      { _id: new ObjectId( req.body._id ) },
      { $set:{ name:req.body.name } }
  )

  res.json( result )

  // add a 'json' field to our request object
  // this field will be available in any additional
  // routes or middleware.

  res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
  res.end(JSON.stringify(appdata))
})

app.listen( process.env.PORT || 3000 )
