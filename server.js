

require("dotenv").config();

let loggedInUser = null;

const express = require("express"),
      { MongoClient, ObjectId } = require("mongodb"),
      cookie = require( 'cookie-session' ),
      app = express()

app.use(express.static("public") )
app.use(express.json() )
app.use( express.urlencoded({ extended:true }) )

// cookie middleware! The keys are used for encryption and should be
// changed
app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))



app.post( '/login', async (req, res) => {

  const user = req.body.username;

  const password = req.body.password;

  const username = await client.db("datatest").collection("accounts").findOne({ username: user });


  if(username !== null){
    if(username.password === password){
      req.session.login = true
      loggedInUser = user;
      res.redirect( 'main.html' )
    }else{
      return res.status(401).send("Incorrect password.");
    }
  }else{
    return res.status(404).send("Username not found.");
  }
})

// add some middleware that always sends unauthenicaetd users to the login page
app.use( function( req,res,next) {
  if( req.session.login === true )
    next()
  else
    res.sendFile( __dirname + '/public/index.html' )
})

// serve up static files in the directory public
app.use( express.static('public') )

const uri = 'mongodb+srv://asjacob:Webware25@cluster0.9xsgz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const client = new MongoClient( uri )

let collection = null
let collection2 = null

async function run() {
  console.log("Hi");
  await client.connect()
  console.log("Connected to DB");
  collection = await client.db("datatest").collection("List")
  collection2 = await client.db("datatest").collection("accounts")

}

app.post("/docs", async (req, res) => {
  if (collection !== null) {
    const docs = await collection.find({}).toArray()
    console.log("Docs" + docs)
    res.json( docs )
  }
})

run()

app.listen(3000)
console.log("listening on port 3000");

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

app.post("/delete-doc", async (req, res) => {
  if (collection !== null) {
    const priorityNumber = req.body.id +1;
    const result = await collection.findOneAndDelete({ priority: priorityNumber });

// Retrieve and sort all remaining documents by type (reverse order) and date
const docs = await collection.find({ user: loggedInUser } )
  .sort({ type: -1, date: 1 }) // Sort type in reverse order and date in ascending order
  .toArray();

// Update priority based on the new sorted order
const updatedDocs = docs.map((doc, index) => ({
  ...doc,
  priority: index + 1
}));

// Bulk update documents with the new priority
await Promise.all(updatedDocs.map(doc =>
  collection.updateOne({ _id: doc._id }, { $set: { priority: doc.priority } })
));

// Retrieve and return all documents from the collection in the desired order
const finalDocs = await collection.find({})
  .sort({ type: -1, date: 1 }) // Again sort by type in reverse order and date in ascending order
  .toArray();

res.json(finalDocs);
  }

});

app.post('/addAccount', async (req, res) => {
  const account = req.body;
  try {
    await collection2.insertOne(account);
    res.status(201).json({ message: 'Account created successfully' }); // Success response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create account' }); // Error response
  }
});

// Route to add a document and return all documents

app.post("/add-doc", async (req, res) => {
  console.log("adding item");
  if (collection !== null) {
    // Add a new item to the collection
    const newDoc = req.body;
    if (Object.keys(newDoc).length !== 0) {
      if (newDoc.type === 'work') {
        newDoc.priority = 1;
      } else if (newDoc.type === 'school') {
        newDoc.priority = 2;
      } else if (newDoc.type === 'personal') {
        newDoc.priority = 3;
      }
      newDoc.user = loggedInUser;
      await collection.insertOne(newDoc);

      // Update priority by type and date and order
      const docs = await collection.find({ user: loggedInUser }).sort({ type: -1, date: 1 }).toArray();
      const updatedDocs = docs.map((doc, index) => ({
        ...doc,
        priority: index + 1
      }));

      // update documents with the new priority
      await Promise.all(updatedDocs.map(doc =>
        collection.updateOne({ _id: doc._id }, { $set: { priority: doc.priority } })
      ));
    }
    const docs =  await collection.find({ user: loggedInUser }).sort({ type: -1, date: 1 }).toArray();
    console.log(docs);
    res.json(docs);
  } else {
    res.status(503).send("Service unavailable");
  }
});

app.post("/update-doc", async (req, res) => {

  if (collection !== null) {
    const { ToDo, type, date } = req.body;

    // Validate input
    if (!ToDo || !type || !date) {
      return res.status(400).send("Invalid input");
    }

    // Prepare the document to update
    const updatedDoc = {
      ToDo,
      type,
      date
    };

    // Update the document with the given id
    const result = await collection.updateOne({ priority: parseInt(req.body.priority) },
    {
      $set: {
        ToDo: req.body.ToDo,
        type: req.body.type,
        date: req.body.date
      }
    });
    console.log(result, req.body)
    if (result.matchedCount === 0) {
      return res.status(404).send("Document not found");
    }

    // Retrieve and return all documents from the collection in the desired order
    const docs = await collection.find({ user: loggedInUser })
      .sort({ type: -1, date: 1 }) // Sort type in reverse order and date in ascending order
      .toArray();

    res.json(docs);
  } else {
    res.status(503).send("Service unavailable");
  }
});

