const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
app.use(express.static("public"))
app.use(express.json())
const uri = `mongodb+srv://supermanbritt2003:${process.env.db_password}@a3.cfniv.mongodb.net/?retryWrites=true&w=majority&appName=A3`
const client = new MongoClient(uri)

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("A3").collection("test");
}
run();

//Get to-do list data
app.get("/data", async (req, res) => {
  if (collection !== null) {
    console.log("got here");//gets here somehow?
    const docs = await collection.find({}).toArray();
    // res.json(docs);
    res.end(JSON.stringify(docs))
  }
})

//Submit new to-do list item
app.post('/submit', async (req, res) => {
  const result = await collection.insertOne(req.body);
  // res.json(result);
  res.end(JSON.stringify(result));
})

app.post('/delete', async (req, res) => {
  const result = await collection.deleteOne(req.body);//need to get the data for the last item
  // res.json(result);
  res.end(JSON.stringify(result));
})

app.listen(process.env.PORT || 3000, () => console.log('Server started!'));