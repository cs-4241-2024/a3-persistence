require('dotenv').config();
const express = require("express"),
      { MongoClient, ObjectId } = require("mongodb"),
      app = express()

app.use(express.static("public") )
app.use(express.json() )


const uri = `mongodb+srv://${process.env.USER_A3}:${process.env.PASSWORD}@cluster0.5hgmv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient( uri )

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("A3").collection("test")
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


app.listen(3000)