//fetch('/docs').then(res=> res.json() ).then(console.log)
require('dotenv').config(); // Load environment variables from .env file
// if testing on own computer need dotenv
const express = require("express"),
      { MongoClient, ObjectId } = require("mongodb"),//objectID allows us to make a key and access things
      app = express()

app.use(express.static("public") )//folder public
app.use(express.json() )


const cookie  = require( 'cookie-session' ),
hbs     = require( 'express-handlebars' ).engine


const uri = `mongodb+srv://${process.env.MYUSER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient( uri )

let collection = null

async function run() {
  await client.connect() //wait for client to connect...
  collection = await client.db("database").collection("name") //my database here collecction variable

  // route to get all docs
  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()// find allows you to pass something in, if blank returns everything inside collection and return results as array
      res.json( docs )
    }
  })
}

app.use( (req,res,next) => {
    if( collection !== null ) {
      next()
    }else{
      res.status( 503 ).send()
    }
  })


// use express.urlencoded to get data sent by defaut form actions
// or GET requests
app.use( express.urlencoded({ extended:true }) )


//add function but not working the way I want currently
app.post( '/add', async (req,res) => {
    const result2 = await collection.findOne({ title: req.body.title });
    if (!result2) {
    const result = await collection.insertOne( req.body )
    console.log(req.body)
    res.render('mainAdd', { msg:'successfully added', layout:false })
    }
    res.render('mainAdd', { msg:'There is book with that title already so it could not be added', layout:false })
})

// assumes req.body takes form { _id:5d91fb30f3f81b282d7be0dd } etc.
app.post( '/remove', async (req,res) => {

    let title = req.body.title;
    const result2 = await collection.findOne({ title: req.body.title });
    if (result2) {
        const result = await collection.deleteOne({ 
            _id:new ObjectId( result2._id )
            })
        console.log(`Successfully deleted document with title: ${title}`);
        res.render('mainRem', { msg:'Successfully deleted', layout:false })
    }else {
        console.log(`No documents found with title: ${title}`);
        res.render('mainRem', { msg:'Could not successfully deleted', layout:false })
    }
})

app.post( '/update', async (req,res) => {
    const result = await collection.updateOne(
      { _id: new ObjectId( req.body._id ) },
      { $set:{ name:req.body.name } }
    )
  
    res.json( result )
})

//cookies



// we're going to use handlebars, but really all the template
// engines are equally painful. choose your own poison at:
// http://expressjs.com/en/guide/using-template-engines.html
app.engine( 'handlebars',  hbs() )
app.set(    'view engine', 'handlebars' )
app.set(    'views',       './views' )



// cookie middleware! The keys are used for encryption and should be
// changed
app.use( cookie({
  name: 'session',
  keys: ['access1', 'access2'] //previously were key1 and key2
}))

app.post( '/login', (req,res)=> {
    // express.urlencoded will put your key value pairs 
    // into an object, where the key is the name of each
    // form field and the value is whatever the user entered
    console.log( req.body )
    
    // below is *just a simple authentication example* 
    // for A3, you should check username / password combos in your database
    if( req.body.password === 'test' ) {
      // define a variable that we can check in other middleware
      // the session object is added to our requests by the cookie-session middleware
      req.session.login = true
      
      // since login was successful, send the user to the main content
      // use redirect to avoid authentication problems when refreshing
      // the page or using the back button, for details see:
      // https://stackoverflow.com/questions/10827242/understanding-the-post-redirect-get-pattern 
      // this one gets run
      res.redirect( 'main.html' )
    }else{
      // cancel session login in case it was previously set to true
      req.session.login = false
      // password incorrect, send back to login page
      res.render('index', { msg:'login failed, please try again', layout:false })
    }
  })
  
  app.get( '/', (req,res) => {
    res.render( 'index', { msg:'', layout:false })
  })
  
  // add some middleware that always sends unauthenicaetd users to the login page
  app.use( function( req,res,next) {
    if( req.session.login === true )
      next()
    else
      res.render('index', { msg:'login failed, please try again', layout:true })
  })
  
  app.get( '/main.html', ( req, res) => {
      res.render( 'main', { msg:'success you have logged in', layout:false })
  })




run()

app.listen(3000)
