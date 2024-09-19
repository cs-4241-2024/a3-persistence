require('dotenv').config()
const express = require( 'express' ),
      { MongoClient, ObjectId } = require("mongodb"),
      app = express()

app.use( express.static( 'public', {index: 'login.html' } ) )
app.use( express.json() )

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient( uri )

let collection = null
let tableLength = 0

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

app.post( '/add', async (req,res) => {
  row = tableLength
  tableLength++
  const insert = await collection.insertOne( req.body )
  res.json( row )
})

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

app.post( '/table', async (req,res) => {
  const table = await collection.find({}).toArray()
  tableLength = table.length
  res.json( table )
})

async function run() {
  await client.connect()
  collection = await client.db("calculator").collection("equation")

  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json( docs )
    }
  })
}

run()

app.listen(3000)