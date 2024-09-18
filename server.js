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

      app.get('/', (req, res) => {
        res.sendFile(__dirname + '/public/index.html');
      });

      app.post( '/login', async (req,res) => {
        // express.urlencoded will put your key value pairs 
        // into an object, where the key is the name of each
        // form field and the value is whatever the user entered
        console.log( req.body )
        
        // below is *just a simple authentication example* 
        // for A3, you should check username / password combos in your database
        if( req.body.password === 'test'  && req.body.username === 'admin' ){ 
          // define a variable that we can check in other middleware
          // the session object is added to our requests by the cookie-session middleware
          req.session.login = true
          res.redirect('/main.html');
          
          // since login was successful, send the user to the main content
          // use redirect to avoid authentication problems when refreshing
          // the page or using the back button, for details see:
          // https://stackoverflow.com/questions/10827242/understanding-the-post-redirect-get-pattern 
        }else{
          // password incorrect, redirect back to login page
          res.sendFile( __dirname + '/public/index.html' )
        }
      })

      app.use( function( req,res,next) {
        if( req.session.login === true )
          next()
        else
          res.sendFile( __dirname + '/public/index.html' )
      })
      

app.use(express.static("public") )
app.use(express.json() )
const path = require('path')

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
//mongodb+srv://jscaproni:<db_password>@cluster0.1aefo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
const client = new MongoClient( uri )

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("datatest").collection("test")
  console.log("Connected to MongoDB");
  // route to get all docs
  //const docs = await collection.find({}).toArray()
  //console.log(docs)
}

run()

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

app.listen(3000)