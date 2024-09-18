require('dotenv').config() //for local development

const express = require("express"),
      cookie  = require( 'cookie-session' ),
      { MongoClient, ObjectId } = require("mongodb"),
      app = express()

app.use( express.urlencoded({ extended:true }) )
app.use(express.static("public") )
app.use(express.json() )

// cookie middleware! The keys are used for encryption and should be
// changed
app.use( cookie({
    name: 'session',
    keys: ['key1', 'key2']
}))

app.use( (req,res,next) => {
    if( collection !== null ) {
      next()
    }else{
      res.status( 503 ).send()
    }
})

app.post( '/login', async (req,res)=> {
    // express.urlencoded will put your key value pairs 
    // into an object, where the key is the name of each
    // form field and the value is whatever the user entered
    console.log( req.body )

    // below is *just a simple authentication example* 
    // for A3, you should check username / password combos in your database

    //try to find username in database
    const target = await collection.findOne( {username: req.body.username} )

    //if it does not exist, add that user to the database
    if (target === null) {
        //FIXMEwindow.alert("username not found in database. creating new user now...")
        console.log(("username not found in database. creating new user now..."))
        const result = await collection.insertOne( req.body )
        res.json( result )
        // define a variable that we can check in other middleware
        // the session object is added to our requests by the cookie-session middleware
        req.session.login = true
        res.redirect( 'home.html' )
    } else {
        if (req.body.password == target.password) {
            req.session.login = true
            res.redirect( 'home.html' )
        } else {
            // password incorrect, redirect back to login page
            //window.alert("password incorrect. please try again") FIXME
            console.log(("password incorrect. please try again"))
            res.sendFile( __dirname + '/public/index.html' )
        }
    }

})

// add some middleware that always sends unautheniticated users to the login page
app.use( function( req,res,next) {
    if( req.session.login === true )
        next()
    else
        res.sendFile( __dirname + '/public/index.html' )
})
  


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

app.post( '/submit', async (req,res) => {
    const result = await collection.insertOne( req.body )
    res.json( result )
})

app.post( '/remove', async (req,res) => {
    const target = await collection.findOne( req.body )
    const result = await collection.deleteOne({
        _id:new ObjectId( target._id ) 
    })
    
    res.json( result )
})

app.post( '/update', async (req,res) => {
    const target = await collection.findOne({ day: req.body.day, type: req.body.type} )
    const result = await collection.updateOne(
      { _id: new ObjectId( target._id ) },
      { $set: req.body.updates }
    )
  
    res.json( result )
})



const listener = app.listen( process.env.PORT || 3000 )