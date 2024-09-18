// server
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
//added cookies on the other script
//THIS IS APPDATA
//appData = []

//app.use(express.static(__dirname + '/public'));

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

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    //console.log("Pinged your deployment. You successfully connected to MongoDB!");
    collection = await client.db("Project_3_Database").collection("My stuff");
    const listener = app.listen(process.env.PORT || 3000)
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

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
  let currTotal;
  //let currName = req.query.name;
  //console.log(JSON.stringify(req.body));

  //let latestValue;
  //console.log(currUserName);
  //let currName = req.query.name;
  let latest = 0;
  let result = await collection.find({
    name: currUserName,
  }).toArray();
  result.sort((a, b) => a.timestamp - b.timestamp);
  //console.log(result.length);
  if((result.length) != 0)
  {
    latest = result[result.length - 1].total;
  }
  


  //console.log(currTotal);
  if (req.body.operation == "Add") {
    //console.log("Made inside the add operation")
    latest = latest + Number(req.body.number);
  }
  if (req.body.operation == "Sub") {
    latest = latest - Number(req.body.number);
  }
  if (req.body.operation == "Mult") {
    latest = latest * Number(req.body.number);
  }
  if (req.body.operation == "Div") {
    latest = latest / Number(req.body.number);
  }

  let newValues = { 'number': Number(req.body.number), 'operation': req.body.operation, 'total': latest, 'name': currUserName, 'timestamp': Math.floor(Date.now() / 1000) };
  //latestInput = newValues;
  //appData.push({ 'firstnum': Number(req.body.firstnum), 'lastnum': req.body.lastnum, 'total': currentTotal });
  let rezult = await collection.insertOne(newValues);
  res.end(JSON.stringify(newValues));
})


app.post('/enter', async (req, res) => {
  let currName = req.body.name;
  let found = await collection.find({name: currName,}).toArray()
  //console.log(currName);
  if(found == null)
  {
    let newValues = {'name': currName};
    let result = await collection.insertOne(newValues);
  } 
  
  res.sendFile(path.join(__dirname, 'public', 'calculate.html'));
})

app.post('/kill', async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });

  //console.log(JSON.stringify(req.body));

  let currUserName = req.body.name;
  //let latestValue;
  //console.log(currUserName);
  //let currName = req.query.name;
  
  let result = await collection.find({
    name: currUserName,
  }).toArray();

  result.sort((a, b) => a.timestamp - b.timestamp);
  let latest = result[result.length - 1];
  //console.log(latest);
  await collection.deleteOne(latest);
  
  res.end(JSON.stringify(latest));
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




