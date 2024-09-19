import express from 'express';
import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import session from 'express-session';
import passport from 'passport';
import './auth.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
dotenv.config();

const uri = `mongodb+srv://ctm6704:${process.env.DB_PASSWORD}@cluster0.y9opn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let collection = null;

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    collection = await client.db("book-tracker").collection("test")
  } catch (err) {   
    console.log(err);
  }
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
}
run();



app.use( express.urlencoded({ extended:true }) )
app.use( express.json() )
app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})
app.use(session({ secret: 'a3', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

app.get("/", ensureAuthenticated, async (req, res) => {
  try {
    collection = await client.db("book-tracker").collection(req.user.id);
  } catch {
    await client.db("book-tracker").createCollection(req.user.id);
    collection = await client.db("book-tracker").collection(req.user.id);
  }
  
  res.sendFile(path.join(__dirname + '/public/index.html'));
})

app.use( express.static('public',{extensions:['html']}))

// Handle post requests and add new book to collection
app.post( '/submit', async (req, res) => {
  const newBook = req.body;
  console.log(newBook);
  // Set derived field
  if (newBook["status"] === "reading" && newBook["started"] === "") {
    const today = new Date().toLocaleDateString("en-us", {year: "numeric", month: "2-digit", day: "2-digit"});
    newBook["started"] = today;
  }
  newBook["avg-pages"] = null;
  try {
    if (newBook["started"] !== "" && newBook["finished"] !== "") { 
      const startDate = new Date(newBook["started"]);
      const finishDate = new Date(newBook["finished"]);
      const diffDays = Math.ceil((finishDate - startDate) / (1000 * 60 * 60 * 24));
      newBook["avg-pages"] = Math.round(newBook["pages"] / diffDays);
    }
  } catch (error) {
    console.log("Error calculating average pages per day: " + error);
  }

  const result = await collection.insertOne( newBook );
  console.log( result );
  res.json( result )
})

// Handle get requests and return all books in collection
app.get("/get", async (req, res) => {
  if (collection !== null) {
    const docs = await collection.find({}).toArray()
    res.json( docs )
  }
})

// Remove book from collection based on object ID
app.post( '/remove', async (req,res) => {
  try {
    const result = await collection.deleteOne({ 
      _id: new ObjectId(req.body._id) 
    })
    console.log(result)
    
    res.json( result )
  } catch( error ) {
    res.writeHead("400", "Bad Request", {'Content-Type': 'text/plain'})
  }
})

// Update book property in collection
app.post( '/update', async (req,res) => {
  const bookKey = req.body.key;
  const bookValue = req.body.value;
  let result = await collection.updateOne(
    { _id: new ObjectId( req.body._id ) },
    { $set:{ [bookKey]: bookValue } }
  )

  if (bookKey === "status") {
    if (bookValue === "reading") {
      const today = new Date().toLocaleDateString("en-us", {year: "numeric", month: "2-digit", day: "2-digit"});
      result = await collection.updateOne(
        { _id: new ObjectId( req.body._id ) },
        { $set:{ "started": today } }
      )
    } else if (bookValue === "read") {
      const today = new Date().toLocaleDateString("en-us", {year: "numeric", month: "2-digit", day: "2-digit"});
      result = await collection.updateOne(
        { _id: new ObjectId( req.body._id ) },
        { $set:{ "finished": today } }
      )
    }
  }

  res.json( result )
})


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

app.listen( process.env.PORT || 3000 )