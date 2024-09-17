const express = require("express"),
{ MongoClient, ObjectId } = require("mongodb"),
app = express()

app.use(express.static("public") )
app.use(express.json() )

// TODO get password from .env
const uri = `mongodb+srv://jdasher:{process.env.PASSWORD}@cs4241db.opedg.mongodb.net/?retryWrites=true&w=majority&appName=CS4241DB`
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

const appdata = []

let collection = null
async function run() {
  await client.connect()
  collection = await client.db("a3-persistance").collection("client_info")

  // route to get all docs
  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({ping: "123"}).toArray()
      console.log(docs);
      res.json( docs )
    }
  })
}

run()

app.listen(3000)
