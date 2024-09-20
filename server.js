require('dotenv').config()

// Mongo DB
const { MongoClient, ObjectId } = require('mongodb');
//Expres Server
const express = require( 'express' ),
    cookie  = require( 'cookie-session' ),
    app = express()

app.use(express.static('views'))
app.use(express.static('public'))
app.use(express.json())

// --------------------MONGO DB------------------------

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient( uri )

let collection = null
let loginData = null

async function run() {
  await client.connect()
  collection = await client.db("assignment3").collection("matches")
  loginData = await client.db("assignment3").collection("login-info")


}

run()

// -------------------COOKIES-----------------------

// use express.urlencoded to get data sent by defaut form actions
// or GET requests
app.use( express.urlencoded({ extended:true }) )

// cookie middleware! The keys are used for encryption and should be
// changed
app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))
app.post( '/login', async (req,res)=> {
  // express.urlencoded will put your key value pairs
  // into an object, where the key is the name of each
  // form field and the value is whatever the user entered
  console.log( req.body )
  let username = req.body.user
  let password = req.body.pass



  // below is *just a simple authentication example*
  // for A3, you should check username / password combos in your database
  let loginDoc = await loginData.findOne({user: username, pass: password})
// Find the user with the matching username

  // If a user is found, check if the password matches
  if(loginDoc!=null &&loginDoc.user === username && loginDoc.pass === password) {

    // define a variable that we can check in other middleware
    // the session object is added to our requests by the cookie-session middleware
    req.session.user = loginDoc.user
    req.session.login = true

    // since login was successful, send the user to the main content
    // use redirect to avoid authentication problems when refreshing
    // the page or using the back button, for details see:
    // https://stackoverflow.com/questions/10827242/understanding-the-post-redirect-get-pattern
    res.status(200).send("Login and Password correct")
  } else {
    console.log("not found")
    res.status(400).send("Either Login or Password are incorrect")
    // password incorrect, redirect back to login page
    res.sendFile( __dirname + '/views/index.html' )
  }
})

// add some middleware that always sends unauthenicaetd users to the login page
app.use( function( req,res,next) {
  if( req.session.login === true )
    next()
  else
    res.sendFile( __dirname + '/public/main.html' )
})

app.use('/newLogin', async (req, res) => {
  console.log( req.body )

  const result = await loginData.insertOne( req.body )
  res.json( result )

})

app.get('/logout', (req, res) => {
  req.session = null; // Clear the session
  res.redirect('/'); // Redirect to the root URL
});

app.get('/userMatches', async (req, res) => {
  if (!req.session.login) {
    return res.status(401).send('Unauthorized');
  }

  const user = req.session.user;
  const matches = await collection.find({ owner: user}).toArray();
  res.json(matches);
});


// route to get all docs
app.get("/docs", async (req, res) => {
  if (collection !== null) {
    const docs = await collection.find({}).toArray()
    res.json( docs )
  }
})

app.post( '/add', async (req,res) => {
  const matchData = req.body;

  // Logic to determine the winner
  let winner;
  if (matchData.Game1B > matchData.Game1A && matchData.Game2B > matchData.Game2A) {
    winner = matchData.SchoolB;
  } else if (matchData.Game1A > matchData.Game1B && matchData.Game2A > matchData.Game2B) {
    winner = matchData.SchoolA;
  } else if (matchData.Game3A > matchData.Game3B) {
    winner = matchData.SchoolA;
  } else{
    winner = matchData.SchoolB;
  }

  // Add the winner to the match data
  matchData.winner = winner;
  matchData.owner = req.session.user;
  console.log(matchData)
  const result = await collection.insertOne( matchData )
  res.json( result )
})

// assumes req.body takes form { _id:5d91fb30f3f81b282d7be0dd } etc.
app.delete( '/remove', async (req,res) => {
  const result = await collection.deleteOne({
    _id:new ObjectId( req.body._id )
  })

  res.json( result )
})

app.get('/getMatch', async (req, res) => {
    const matchId = req.query.id;
    if (!matchId) {
        return res.status(400).json({ error: 'Match ID is required' });
    }

    const match = await collection.findOne({ _id: new ObjectId(matchId) });
    if (!match) {
        return res.status(404).json({ error: 'Match not found' });
    }

    res.json(match);
});

app.post( '/update', async (req,res) => {
  const matchData = req.body;
  const matchId = req.query.id;
  // Logic to determine the winner
  let winner;
  if (matchData.Game1B > matchData.Game1A && matchData.Game2B > matchData.Game2A) {
    winner = matchData.SchoolB;
  } else if (matchData.Game1A > matchData.Game1B && matchData.Game2A > matchData.Game2B) {
    winner = matchData.SchoolA;
  } else if (matchData.Game3A > matchData.Game3B) {
    winner = matchData.SchoolA;
  } else{
    winner = matchData.SchoolB;
  }

  // Add the winner to the match data
  matchData.winner = winner;

  const result = await collection.updateOne(
      { _id: new ObjectId( matchId ) },
      { $set: matchData }
  )

  res.json( result )
})


app.listen( process.env.PORT || 3000 )
