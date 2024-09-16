const express = require('express');
const cookie = require( 'cookie-session' );
const hbs = require( 'express-handlebars').engine;
const fs = require('fs');
const mime = require('mime');
const path = require('path');
const app = express();
const port = 3000;
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = "mongodb+srv://jmsmith2:testingwizard456@assignment3-database.oiv2l.mongodb.net/?retryWrites=true&w=majority&appName=Assignment3-Database"

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
    collection = await client.db('EmployeeDB').collection('Users');
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


let appdata = [
  { 'employeeid': '123456789', 'name': 'John Doe', 'salary': 57000, 'regdate': 2021, 'expdate': 2026 },
  { 'employeeid': '987563409', 'name': 'Jack Smith', 'salary': 75000, 'regdate': 2019, 'expdate': 2024 },
  { 'employeeid': '456891237', 'name': 'Jane Lee', 'salary': 90000, 'regdate': 2020, 'expdate': 2025 }
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/data', (req, res) => {
  res.status(200).json(appdata);
});

app.get("/docs", async (req, res) => {
  if (collection !== null) {
    const docs = await collection.find({}).toArray()
    console.log(docs)
    res.json( docs )
  }
})

app.post('/submit', (req, res) => {
  const newData = req.body;
  const newEntry = {
    employeeid: newData.employeeid,
    name: newData.yourname,
    salary: newData.salary,
    regdate: newData.regdate,
    expdate: parseInt(newData.regdate) + 5
  };
  
  appdata.push(newEntry);
  res.status(200).json(appdata);
});

app.put('/edit/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const updatedData = req.body;

  if (index >= 0 && index < appdata.length) {
    appdata[index] = {
      employeeid: updatedData.employeeid,
      name: updatedData.name,
      salary: updatedData.salary,
      regdate: updatedData.regdate,
      expdate: parseInt(updatedData.regdate) + 5
    };
    res.status(200).json(appdata);
  } else {
    res.status(400).send('Invalid index');
  }
});

app.delete('/delete/:index', (req, res) => {
  const index = parseInt(req.params.index);

  if (index >= 0 && index < appdata.length) {
    appdata.splice(index, 1);
    res.status(200).json(appdata);
  } else {
    res.status(400).send('Invalid index');
  }
});

app.listen(process.env.PORT || port, () => {
  console.log(`Server is running on port ${port}`);
});
