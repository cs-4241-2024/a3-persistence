require('dotenv').config()
const express = require( 'express' ),
      { MongoClient, ObjectId } = require("mongodb"),
      app = express()

app.use( express.static( 'public' ) )
app.use( express.json() )

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient( uri )

let collection = null

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

app.post( '/add', async (req,res) => {
  const result = await collection.insertOne( req.body )
  res.json( result )
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

async function run() {
  await client.connect()
  collection = await client.db("datatest").collection("test")

  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json( docs )
    }
  })
}

run()

app.listen(3000)



// app.post( '/submit', express.json(), (req, res) => {

//   values = req.body
//   let result = -0
//   switch(values.operator) {
//     case 'addition':
//       result = Number(values.firstvalue) + Number(values.secondvalue)
//       break
//     case 'subtraction':
//       result = Number(values.firstvalue) - Number(values.secondvalue)
//       break
//     case 'multiplication':
//       result = Number(values.firstvalue) * Number(values.secondvalue)
//       break
//     case 'division':
//       result = Number(values.firstvalue) / Number(values.secondvalue)
//       break
//   }

//   res.writeHead( 200, { 'Content-Type': 'application/json' })
//   res.end( JSON.stringify( result ) )
// })

// app.listen( process.env.PORT || 3000 )