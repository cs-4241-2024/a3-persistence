require("dotenv").config()
const express = require("express")
const path = require('path')
const cookie  = require('cookie-session')
const compression = require('compression')
const { MongoClient, ObjectId, MongoCursorInUseError } = require("mongodb")

const app = express()

app.use(compression())

app.use(express.urlencoded({ extended: true }))
app.use(cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))
app.use(express.static("public"))
app.use(express.json())

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient(uri)

let collection = null
let userDatabase = null

async function run() {
  await client.connect()
  collection = await client.db("datatest").collection("test")
  userDatabase = await client.db("users").collection("userInfo")
  console.log("Connected to MongoDB")
}

run().catch(console.dir)
      app.post('/login', async (req, res) => {
          console.log(req.body);
      
          let currName = req.body.username;
          let currPass = req.body.password;
          let found = await userDatabase.find({ name: currName}).toArray();

      
          if (found.length === 0) {
              await client.db("users").collection("userInfo").insertOne({ name: currName, password: currPass });
          }

          if(currPass === found[0].password && found[0].password !== undefined) {

          req.session.user = req.body.username;  
          console.log(req.session);

          res.json({ user: req.session.user });
          }
      });

app.get("/docs", async (req, res) => {
  if (collection !== null) {
    const docs = await collection.find({}).toArray()
    console.log(docs)
    res.json( docs )
  }
})

    app.post('/add', async (req, res) => {
      const currentItem = req.body.item; 
      const currentDescription = req.body.description;
      const currentCost = parseFloat(req.body.cost);
      const currentTax = parseFloat(req.body.tax);
      const currentTag = req.body.tag;
      const calcTotal = currentCost * (1 + currentTax);
      const currUser = req.session.user;
  
      const newItem = {
          item: currentItem,
          description: currentDescription,
          cost: currentCost,
          tax: currentTax,
          total: calcTotal,
          tag: currentTag,
          user: currUser
      };
  
      const result = await client.db("datatest").collection("test").insertOne(newItem);
      const tableUpdate = await client.db("datatest").collection("test").find({ user: currUser }).toArray();
  
      const updatedTable = tableUpdate.map(item => ({
          _id: item._id,
          item: item.item,
          description: item.description,
          cost: item.cost,
          tax: item.tax,
          total: item.total,
          tag: item.tag,
          user: item.user
      }));
  
      res.json(updatedTable);
  });              

  app.delete( '/remove', async (req,res) => {
    console.log(req.body, "removed successfully console log");
    const result = await collection.deleteOne({ _id: new ObjectId( req.body._id ) });
  const tableUpdate = await collection.find({ user: req.session.user }).toArray();
  res.json(tableUpdate);
  })
  

app.put('/update', async (req, res) => {
        console.log(req.body, "updated successfully console log");

        const objectId = new ObjectId(req.body._id);

        console.log({ _id: objectId }, "Query to update document");

        const result = await collection.updateOne(
            { _id: objectId },
            { $set: { 
                item: req.body.item,
                description: req.body.description,
                cost: req.body.cost,
                tax: req.body.tax,
                total: req.body.total,
                tag: req.body.tag,
                user: req.body.user
            }}
        );

        console.log(result, "result");

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'No document found with the provided _id' });
        }

        const tableUpdate = await collection.find({ user: req.session.user }).toArray();
        res.json(tableUpdate);
});
  
  app.get('/load', async (req, res) => {
      const tableUpdate = await collection.find({ user: req.session.user }).toArray();
      const updatedTable = tableUpdate.map(item => ({
          _id: item._id,
          item: item.item,
          description: item.description,
          cost: item.cost,
          tax: item.tax,
          total: item.total,
          tag: item.tag,
          user: item.user
      }));
      res.json(updatedTable);
  });

app.listen(3000)