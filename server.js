require('dotenv').config();


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MongoDBLink;
let current_user = null; // User variable to track whos logged in

const express    = require('express'),
      app        = express(),
      port       = 3000
     
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function mongoconnect() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("webware").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

mongoconnect()

app.use( express.static( 'public' ) )
app.use( express.static( 'views'  ) )
app.use( express.json() )

// Add Data to database
// Each user data will have their own collection
// Each collection holds list of json objects for that user
app.post( '/submit', express.json(), async ( req, res ) => {
  let str = req.body.str
  let data_json = {}
  const data_array = str.split(',')

  // create the json data object
  for (let i = 0; i < data_array.length; i++){
    if (i === 0) {
      data_json.name = data_array[i]
    }
    else if (i === 1) {
      data_json.email = data_array[i]
    }
    else if (i === 2){
      data_json.phone = data_array[i]
    }
    else if (i === 3){
      data_json.age = data_array[i]
      // Dynamic attribute
      if (parseInt(data_array[i]) < 19)
        data_json.grade = 'Freshman'
      else if (parseInt(data_array[i]) < 20)
        data_json.grade = 'Sophomore'
      else if (parseInt(data_array[i]) < 21)
        data_json.grade = 'Junior'
      else {
        data_json.grade = 'Senior'
      }
    }
  }

  try {
    await client.connect();
    // Find current users data collection
    const collection = client.db("webware").collection(current_user);
    
    // Add data to collection
    await collection.insertOne(data_json)

    res.writeHead( 200, { 'Content-Type': 'text/plain'})
    res.end( 'Success inserting data' )

  } catch (error){
    console.error(error)
    res.writeHead( 500, { 'Content-Type': 'text/plain'})
    res.end( 'error inserting data' )
    return
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
})

// Delete items from a users data
app.post( '/delete', express.json(), async ( req, res ) => {
  let name_to_delete = req.body.str
  
  try {
    await client.connect();
    // Find current users data collection
    const collection = client.db("webware").collection(current_user);
    
    // Add data to collection
    await collection.deleteOne({name: name_to_delete})

    res.writeHead( 200, { 'Content-Type': 'text/plain'})
    res.end( 'Success Deleting data' )

  } catch (error){
    console.error(error)
    res.writeHead( 500, { 'Content-Type': 'text/plain'})
    res.end( 'error deleting data' )
    return
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
})

app.post( '/edit', express.json(), async ( req, res ) => {
  let name = req.body.name;
  let edit = req.body.edit;
  let new_value = req.body.new_value;
  
  try {
    await client.connect();
    // Find current users registered collection
    const collection = client.db("webware").collection(current_user);

    // Try and find correct name ot edit
    let user_to_edit = await collection.findOne({ 'name': name });
    
    if (!user_to_edit){
      res.writeHead( 500, { 'Content-Type': 'text/plain'})
      res.end( 'error retrieving data' )
      return
    }

    if (edit === '1'){
      await collection.updateOne({'name' : name},
        {$set : {'name' : new_value}}
      )
    }
    if (edit === '2'){
      await collection.updateOne({'name' : name},
        {$set : {'email' : new_value}}
      )
    }
    if (edit === '3'){
      await collection.updateOne({'name' : name},
        {$set : {'phone' : new_value}}
      )
    }
    if (edit === '4'){
      await collection.updateOne({'name' : name},
        {$set : {'grade' : new_value}}
      )
    }

    return res.status(200).send('changes made successfully');
    
  } catch (error){
    console.error(error)
    return res.status(304).send('Error making change made');
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
});


// After login update the current user
app.post( '/login', express.json(), async ( req, res ) => {
  let username = req.body.username;
  let password = req.body.password;
  let valid_users = []
  try {
    await client.connect();
    // Find current users registered collection
    const collection = client.db("webware").collection('usersAccounts');

    // Get user account info
    valid_users = await collection.find({}).toArray();

  } catch (error){
    console.error(error)
    res.writeHead( 500, { 'Content-Type': 'text/plain'})
    res.end( 'error retrieving data' )
    return
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }

  //Try and find a match in valid users
  const user = valid_users.find(user => user.username === username)

  // Check if user exists
  if(!user){
    res.writeHead(401, { 'Content-Type': 'text/plain'})
    res.end('Invalid username')
    return
  }
  
  // Check if passwords match
  if (user.password != password){
    res.writeHead(401, { 'Content-Type': 'text/plain'})
    res.end('Password invalid')
    return
  }

  // Set new user
  current_user = username

  res.writeHead( 200, { 'Content-Type': 'application/json'})
  res.end(JSON.stringify(user))
})

// Retrieve data from the database
// Sends list of json objects for current user
app.get('/data', async (req, res) => {

  try {
    await client.connect();
    // Find current users data collection
    const collection = client.db("webware").collection(current_user);

    // Get user data in form of array of json
    const user_data = await collection.find({}).toArray();

    // Send user data back
    res.status(200).json(user_data)

  } catch (error){
    console.error(error)
    res.writeHead( 500, { 'Content-Type': 'text/plain'})
    res.end( 'error retrieving data' )
    return
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
});

// Add a user account to database
app.post( '/signup', express.json(), async ( req, res ) => {
  let username = req.body.username
  let password = req.body.password

  // create json for user account info
  const user_signup = {}
  user_signup.username = username
  user_signup.password = password

  try {
    await client.connect();

    // Find current users collection
    const collection = client.db("webware").collection('usersAccounts');
    
    // Add data to collection
    await collection.insertOne(user_signup)

    res.writeHead( 200, { 'Content-Type': 'text/plain'})
    res.end( 'Success inserting data' )

  } catch (error){
    console.error(error)
    res.writeHead( 500, { 'Content-Type': 'text/plain'})
    res.end( 'error inserting data' )
    return
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
})

app.listen( process.env.PORT || port)