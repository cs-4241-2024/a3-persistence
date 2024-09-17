/*
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://supermanbritt2003:<db_password>@a3.cfniv.mongodb.net/?retryWrites=true&w=majority&appName=A3";
// const uri = "mongodb+srv://supermanbritt2003:<=${db_password}@a3.cfniv.mongodb.net/?retryWrites=true&w=majority&appName=A3";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);*/

//CODE FROM MONGODB SETUP ABOVE


// const cookie = require('cookie-session');
// const hbs = require('express-handlebars').engine;
const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config();
const app = express();
const http = require('http');
const PORT = 3000;

// const uri = "mongodb+srv://supermanbritt2003:Y97Dvkvgd0tm3zjN@a3.cfniv.mongodb.net/?retryWrites=true&w=majority&appName=A3";

const uri = "mongodb+srv://supermanbritt2003:" + process.env.db_password + "@a3.cfniv.mongodb.net/?retryWrites=true&w=majority&appName=A3";

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
}
connect();
app.listen(PORT, () => console.log('Server started on ${PORT}'));

/*
// fs = require('fs');
// IMPORTANT: you must run `npm install` in the directory for this assignment
// to install the mime library if you're testing this on your local machine.
// However, Glitch will install it automatically by looking in your package.json
// file.
// mime = require('mime'),
// dir = 'public/',
// const port = 3000;

// use express.urlencoded to get data sent by defaut form actions
// or GET requests
app.use(express.urlencoded({ extended: true }))
//app.use( express.json() )

// we're going to use handlebars, but really all the template
// engines are equally painful. choose your own poison at:
// http://expressjs.com/en/guide/using-template-engines.html
app.engine('handlebars', hbs())
app.set('view engine', 'handlebars')
app.set('views', './views')

// Cookie middleware! The keys are used for encryption and should be changed
app.use(cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.post('/login', (req, res) => {
  // express.urlencoded will put your key value pairs 
  // into an object, where the key is the name of each
  // form field and the value is whatever the user entered
  console.log(req.body)

  // below is *just a simple authentication example* 
  // for A3, you should check username / password combos in your database
  if (req.body.password === 'test') {
    // define a variable that we can check in other middleware
    // the session object is added to our requests by the cookie-session middleware
    req.session.login = true

    // since login was successful, send the user to the main content
    // use redirect to avoid authentication problems when refreshing
    // the page or using the back button, for details see:
    // https://stackoverflow.com/questions/10827242/understanding-the-post-redirect-get-pattern 
    res.redirect('main.html')
  } else {
    // cancel session login in case it was previously set to true
    req.session.login = false
    // password incorrect, send back to login page
    res.render('index', { msg: 'login failed, please try again', layout: false })
  }
})

app.get('/', (req, res) => {
  res.render('index', { msg: '', layout: false })
})

// add some middleware that always sends unauthenicaetd users to the login page
app.use(function (req, res, next) {
  if (req.session.login === true)
    next()
  else
    res.render('index', { msg: 'login failed, please try again', layout: false })
})

app.get('/main.html', (req, res) => {
  res.render('main', { msg: 'success you have logged in', layout: false })
})

app.listen(process.env.PORT || 3000)



///////NEW CODE ABOVE FROM PROF GLITCH

const http = require('http'),
  fs = require('fs'),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library if you're testing this on your local machine.
  // However, Glitch will install it automatically by looking in your package.json
  // file.
  mime = require('mime'),
  dir = 'public/',
  port = 3000

let appdata = [];

const server = http.createServer(function (request, response) {
  if (request.method === 'GET') {
    handleGet(request, response);
  } else if (request.method === 'POST') {
    handlePost(request, response);
  } else if (request.method === 'DELETE') {
    handleDelete(request, response);
  }
})

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1);
  if (request.url === '/') {
    sendFile(response, 'public/index.html');
  }
  else if (request.url === '/data') {
    response.end(JSON.stringify(appdata));
  }
  else {
    sendFile(response, filename);
  }
}

const handlePost = function (request, response) {
  let dataString = '';

  request.on('data', function (data) {
    dataString += data;
  })

  request.on('end', function () {
    const newData = JSON.parse(dataString);

    console.log("newData", newData)
    console.log("classcode", newData[0].classCode)
    const classCode = newData[0].classCode;
    const className = newData[0].className;
    const assignment = newData[0].assignment;
    const daysLeft = newData[0].daysLeft;
    let daysToAdd = parseInt(daysLeft);
    if (isNaN(daysLeft)) {
      //Is not a number
      daysToAdd = 0;
    }
    if (daysToAdd === null) {
      daysToAdd = 0;
    }
    let date = new Date();
    date.setDate(date.getDate() + daysToAdd);

    appdata.push({
      'classCode': classCode,
      'className': className,
      'assignment': assignment,
      'daysLeft': daysLeft,
      'dueDate': date.toDateString()
    });
    console.log("appdata:", appdata)

    response.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
    response.end(JSON.stringify(appdata))
  })
}

handleDelete = function (request, response) {
  let dataString = '';

  request.on('data', function (data) {
    dataString += data;
  })

  request.on('end', function () {
    if (appdata.length > 0) {
      appdata.pop();
    }

    console.log("appdata:", appdata)

    response.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
    response.end(JSON.stringify(appdata))
  })
}

const sendFile = function (response, filename) {
  const type = mime.getType(filename);

  fs.readFile(filename, function (err, content) {

    // if the error = null, then we've loaded the file successfully
    if (err === null) {

      // status code: https://httpstatuses.com
      response.writeHeader(200, { 'Content-Type': type })
      response.end(content)

    } else {

      // file not found, error code 404
      response.writeHeader(404)
      response.end('404 Error: File Not Found')

    }
  })
}

server.listen(process.env.PORT || port)
*************/