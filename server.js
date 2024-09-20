require("dotenv").config()
const express = require("express"),
cookie  = require( 'cookie-session' ),
      { MongoClient, ObjectId } = require("mongodb"),
      app = express()

      app.use( express.urlencoded({ extended:true }) )


      app.use( cookie({
        name: 'session',
        keys: ['key1', 'key2']
      }))

      app.use(express.static("public") )
app.use(express.json() )
const path = require('path')

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
//mongodb+srv://jscaproni:<db_password>@cluster0.1aefo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
const client = new MongoClient( uri )

let collection = null
let userDatabase = null

async function run() {
  await client.connect()
  collection = await client.db("datatest").collection("test")
  userDatabase = await client.db("users").collection("userInfo")
  console.log("Connected to MongoDB");
  // route to get all docs
  //const docs = await collection.find({}).toArray()
  //console.log(docs)
}

run()

      app.get('/', (req, res) => {
        res.sendFile(__dirname + '/public/index.html');
      });
      
      
      app.post('/login', async (req, res) => {
          console.log(req.body);
      
          let currName = req.body.username;
          let currPass = req.body.password;
          let found = await userDatabase.find({ name: currName, password: currPass }).toArray();
      
          if (found.length === 0) {
              await client.db("users").collection("userInfo").insertOne({ name: currName, password: currPass });
          }
      
          res.sendFile(path.join(__dirname, 'public', 'main.html'));
      
          // Uncomment if needed
          // await client.db("datatest").collection("test").insertOne({ name: "works" });
      });

      

      app.use( function( req,res,next) {
        if( req.session.login === true )
          next()
        else
          res.sendFile( __dirname + '/public/index.html' )
      })
      



/*app.get("/", (req, res) => {
  res.send("Welcome to the home page!");
});*/

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve index.html for the root URL
});

app.use(express.static(path.join(__dirname, 'public')));

app.get("/docs", async (req, res) => {
  if (collection !== null) {
    const docs = await collection.find({}).toArray()
    console.log(docs)
    res.json( docs )
  }
})

app.use( (req,res,next) => {
    if( collection !== null ) {
      next()
    }else{
      res.status( 503 ).send()
    }
  })

  app.post( '/add', async (req,res) => {
    console.log(req.body, "added successfully console log");
    currentItem = req.body.item;
    currentDescription = req.body.description;
    currentCost = parseFloat(req.body.cost);
    currentTax = parseFloat(req.body.tax);
    currentTag = req.body.tag;
    calcTotal = currentCost * (1 + currentTax);
    const result = await client.db("datatest").collection("test").insertOne({item: currentItem, description: currentDescription, cost: currentCost, tax: currentTax, total: calcTotal, tag: currentTag});
    res.json({
      item: currentItem,
      description: currentDescription,
      cost: currentCost,
      tax: currentTax,
      total: calcTotal,
      tag: currentTag
    });
    
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

app.listen(3000)