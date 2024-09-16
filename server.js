const express = require("express"),
      cookie  = require( "cookie-session" ),
      { MongoClient, ObjectId } = require("mongodb"),
      app = express()

app.use(express.static('views') )
app.use(express.static('public') )
app.use(express.json())
app.use(express.urlencoded({extended: true }));

// cookie middleware! The keys are used for encryption and should be
// changed
app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))

const uri = `mongodb+srv://${process.env.user}:${process.env.password}@cluster0.yjbwv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
const client = new MongoClient( uri )

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("datatest").collection("test")


  app.post( '/login', async (req,res)=> {
  // express.urlencoded will put your key value pairs 
  // into an object, where the key is the name of each
  // form field and the value is whatever the user entered
  // below is *just a simple authentication example* 
  // for A3, you should check username / password combos in your database
  let count = await collection.count({username: req.body.username, password: req.body.password}, {limit: 1})
  if( count ) {
    // define a variable that we can check in other middleware
    // the session object is added to our requests by the cookie-session middleware
    req.session.login = true
    req.session.username = req.body.username
    console.log( req.session )
    
    // since login was successful, send the user to the main content
    // use redirect to avoid authentication problems when refreshing
    // the page or using the back button, for details see:
    // https://stackoverflow.com/questions/10827242/understanding-the-post-redirect-get-pattern 
    res.redirect( 'main.html' )
   }else{
     let count2 = await collection.count({username: req.body.username}, {limit: 1})
     if(count2){
       // password incorrect, redirect back to login page
       res.sendFile( __dirname + '/views/index.html' )
     }else{
    let values = {username: req.body.username, password: req.body.password};
    await collection.insertOne(values)
    req.session.login = true
    res.redirect( 'main.html' )
    }
   }
  })

  // add some middleware that always sends unauthenicaetd users to the login page
  app.use( function( req,res,next) {
    if( req.session.login === true )
      next()
    else
      res.sendFile( __dirname + '/views/index.html' )
  })

  // serve up static files in the directory public
  app.use( express.static('views') )

  const listener = app.listen( process.env.PORT || 3000 )

  // route to get all docs
  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({id: req.session.username}).toArray()
      console.log(docs)
      res.json( docs )
    }
  })

  app.post( '/submit', async (request,response) => {
    console.log(request.body)
    let score = request.body.score
    let rank = ''
    if(Number(score) < 1000) {
      rank = 'E'
    } else if(score < 5000) {
      rank = 'D'
    } else if(score < 10000) {
      rank = 'C'
    } else if(score < 20000) {
      rank = 'B'
    } else if(score < 30000) {
      rank = 'A'
    } else {
      rank = 'S'
    }
    console.log( request.session )
    let _id = {id: request.session.username}
    console.log(_id)
    let values = {id: request.session.username, yourname: request.body.yourname, game: request.body.game, score: request.body.score, rank: rank};
    let result = await collection.insertOne(values)
    //console.log(result)
    response.json(result)
  })
  
  // assumes req.body takes form { _id:5d91fb30f3f81b282d7be0dd } etc.
  app.post( '/delete', async (request,response) => {
    console.log(request.body)
    console.log( request.session )
    let _id = {id: request.session.username}
    console.log(_id)
    let values = {id: request.session.username, yourname: request.body.yourname, game: request.body.game, score: request.body.score}
    const result = await collection.deleteOne(values)
  
    response.json( result )
  })
  
  app.post( '/modify', async (request,response) => {
    console.log(request.body)
    let score = request.body.score2
    let rank = ''
    if(Number(score) < 1000) {
      rank = 'E'
    } else if(score < 5000) {
      rank = 'D'
    } else if(score < 10000) {
      rank = 'C'
    } else if(score < 20000) {
      rank = 'B'
    } else if(score < 30000) {
      rank = 'A'
    } else {
      rank = 'S'
    }
    console.log( request.session )
    let _id = {id: request.session.username}
    console.log(_id)
    let values = {id: request.session.username, yourname: request.body.yourname1, game: request.body.game1, score: request.body.score1};
    const result = await collection.updateOne(values,
      { $set: {yourname: request.body.yourname2, game: request.body.game2, score: request.body.score2, rank: rank} }
    )

    response.json( result )
  })
  
}

run().catch(console.dir);
