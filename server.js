// server
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
//THIS IS APPDATA
//appData = []

app.use(express.static(__dirname + '/public'));

const { MongoClient, ServerApiVersion, LEGAL_TLS_SOCKET_OPTIONS } = require('mongodb');
const { setDefaultResultOrder } = require('dns');
const uri = "mongodb+srv://dragonweirdo4714:Awsome4714@cluster0.rnqdw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

//Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let collection;
//let latestInput;
//
app.use(express.static('views'))
app.use(express.static('public'))
app.use(express.json());
//if something is encoed, decode it
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(express.json())


app.get('/data', async (req, res) => {
  //let foundData = 
  res.writeHead(200, { 'Content-Type': 'application/json' })
  let currName = req.query.name;
  let result = await collection.find({
    name: currName,
  }).toArray();
  //console.log(currName);
  //console.log(result);

  res.end(JSON.stringify(result))
})

//puts a new number and calculation into the database for a specified user
app.post('/submit', async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  let currUserName = req.body.name;
  //console.log(req.body);

  //let currName = req.query.name;
  let currTotal = 0;
  let result = await collection.find({
    name: currUserName,
  }).toArray().then();

  if (result != null) {
    console.log(result);
    currTotal = result[result.length - 1].total;
  }
  if (req.body.operation == "Add") {
    //console.log("Made inside the add operation")
    currTotal = currTotal + Number(req.body.number);
  }
  if (req.body.operation == "Sub") {
    currTotal = currTotal - Number(req.body.number);
  }
  if (req.body.operation == "Mult") {
    currTotal = currTotal * Number(req.body.number);
  }
  if (req.body.operation == "Div") {
    currTotal = currTotal / Number(req.body.number);
  }

  let newValues = { 'number': Number(req.body.number), 'operation': req.body.operation, 'total': currTotal, 'name': currUserName, 'timestamp': Math.floor(Date.now() / 1000) };
  //latestInput = newValues;
  //appData.push({ 'firstnum': Number(req.body.firstnum), 'lastnum': req.body.lastnum, 'total': currentTotal });
  let rezult = await collection.insertOne(newValues);
  res.end(JSON.stringify(newValues));
})


app.post('/enter', async (req, res) => {
  //let foundData = 
  
  res.writeHead(200, { 'Content-Type': 'text/html' })
  
  let currName = req.body.name;
  console.log(currName);
  let result = await collection.find({
    name: currName,
  }).toArray()
  console.log(currName);
  console.log(result);
  console.log(res.json(result));
  if(result != null)
  {
    
    res.sendFile(path.join(__dirname, 'public', 'calculate.html'));
    //res.write(result);
    //next();
  }
  else
  {
    let newValues = { 'name': currName };
    let rezult = await collection.insertOne(newValues);
    res.sendFile(path.join(__dirname, 'public', 'calculate.html'));
    //next();
    //res.write(result);
  }
  res.end();
})



app.post('/kill', async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })


  let poppedValue = collection.find({ firstnum: 'latestInput.firstnum' })

  //res.end(JSON.stringify(appData))
})

/*res.writeHead(200, { 'Content-Type': 'application/json' })
let responce = req;
console.log(responce.body);
if (responce[responce.length - 1].lastnum == "Add" || responce[responce.length - 1].lastnum == "Sub"
  || responce[responce.length - 1].lastnum == "Mult" || responce[responce.length - 1].lastnum == "Div") {
  if (responce[responce.length - 1].lastnum == "Add") {
    currentTotal = Number(responce[responce.length - 1].firstnum) + currentTotal;
  }
  if (responce[responce.length - 1].lastnum == "Sub") {
    currentTotal = currentTotal - Number(responce[responce.length - 1].firstnum);
  }
  if (responce[responce.length - 1].lastnum == "Mult") {
    currentTotal = Number(responce[responce.length - 1].firstnum) * currentTotal;
  }
  if (responce[responce.length - 1].lastnum == "Div") {
    currentTotal = currentTotal / (responce[responce.length - 1].firstnum);
  }
  appData.push({ 'firstnum': responce[responce.length - 1].firstnum, 'lastnum': responce[responce.length - 1].lastnum, 'total': currentTotal });
}
//appData.push(req.body)
//res.end(JSON.stringify(appData))
 
 
})*/




async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    collection = await client.db("Project_3_Database").collection("My stuff");
    const listener = app.listen(process.env.PORT || 3000)
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);