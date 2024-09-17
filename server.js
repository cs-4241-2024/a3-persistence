const express = require("express"),
  { MongoClient, ObjectId } = require("mongodb"),
  app = express()
require("dotenv").config();
app.use(express.static("./"))
app.use(express.json())
const uri = `mongodb+srv://supermanbritt2003:${process.env.db_password}@a3.cfniv.mongodb.net/`
const client = new MongoClient(uri)

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("datatest6").collection("test")
}
run()

// route to get all docs
app.get("/docs", async (req, res) => {
  if (collection !== null) {
    const docs = await collection.find({}).toArray()
    res.json(docs)
  }
})

app.post('/add', async (req, res) => {
  const result = await collection.insertOne(req.body)
  res.json(result)
})

// app.listen(process.env.PORT || 3000)
app.listen(process.env.PORT || 3000, () => console.log('Server started!'));