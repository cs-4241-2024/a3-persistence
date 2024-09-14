require('dotenv').config();

const express = require("express"),
  app = express(),
  { MongoClient, ObjectId } = require("mongodb");
var passport = require('passport');
var util = require('util');
var session = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var GitHubStrategy = require('passport-github2').Strategy;
var partials = require('express-partials');


var GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
var GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const uri = `mongodb+srv://server:${process.env.PASS}@${process.env.HOST}`;
const client = new MongoClient(uri);
console.log(uri);

let collection = null


app.listen(process.env.PORT || 3000);

let appdata = {
}

// Get back a JSON object with the row's data
const getRowByKey = function (key) {
  for (let row of appdata.rows) {
    // Intentionally allowing type conversion
    if (row.key == key) {
      return row;
    }
  }
  // console.log("data: ", appdata);
  console.log("Bad row request. Requested key: ", key);
  return null;
}

const handleGet = async function (request, response) {
  // console.log(request.user);
  if (collection !== null) {
    const docs = await collection.find({ userID: request.user }).toArray()
    let userData = appdata[request.user];
    userData.rows = docs;
    for (let row of userData.rows) {
      row.key = row._id;
    }
    // console.log("appdata ", appdata);
    response.json(userData);
  } else {
    console.log("uh oh");
  }
};

// Sort and then send the current table
const sortAndSend = function (request, response) {
  appdata[request.user].rows.sort(function (a, b) {
    // Principally sort by done-ness
    let aint = a.done ? 1 : 0;
    let bint = b.done ? 1 : 0;
    // console.log("a.done ", a.done, " aint, ", aint, " b.done ", b.done, " bint ", bint);
    let diff = aint - bint;
    if (diff === 0) {
      // If same done-ness, sort by days left
      diff = b.daysLeft - a.daysLeft;
      // console.log("sorting by date");
      if (diff === 0) {
        // If same days left, sort alphabetically
        diff = a.task.localeCompare(b.task);
      }
    }
    return diff;
  });
  response.writeHead(200, "OK", { "Content-Type": "text/plain" });
  response.end(JSON.stringify(appdata[request.user]));
};

const handleSubmit = async function (request, response) {
  console.log("handleSubmit: " + JSON.stringify(request.body));
  const requestData = request.body;
  let dateObj = new Date(requestData.due);
  let today = new Date();
  requestData.daysLeft = dateObj.getDate() - today.getDate();
  requestData.userID = request.user;
  // console.log("handleSubmit: today.getDate() ", today.getDate(), " dateObj.getDate() ", dateObj.getDate());

  const result = await collection.insertOne(requestData);
  requestData.key = result.insertedId.toString();
  appdata[request.user].rows.push(requestData);

  // console.log("appdata request user ", appdata[request.user]);
  sortAndSend(request, response);
};

const handleDelete = async function (request, response) {
  const data = request.body;
  console.log("Received delete request for " + JSON.stringify(request.body));
  let idx = undefined;
  for (let i = 0; i < appdata[request.user].rows.length; i++) {
    if (appdata[request.user].rows[i].key == data.key) {
      // console.log("Found row");
      idx = i;
      break;
    }
  }
  if (idx != undefined) {
    console.log("Deleting.");
    appdata[request.user].rows.splice(idx, 1);
  }

  try {
    // console.log("key ", data.key);
    const result = await collection.deleteOne(
      { _id: new ObjectId(data.key), userID: request.user }
    )
    // console.log("deleted ", result.deletedCount);
  } finally {
    sortAndSend(request, response);
  }
};

const tickBox = async function (request, response) {
  console.log("Box request, ", request.body);
  const data = request.body;
  const result = await collection.updateOne(
    { _id: new ObjectId(data.key) },
    { $set: { done: data.value } }
  )
  // console.log("updated ", result.matchedCount);
  let row = getRowByKey(data.key);
  row.done = data.value;
  // console.log("Set done to ", row.done);



  sortAndSend(request, response);
}

app.use((req, res, next) => {
  if (collection !== null) {
    next()
  } else {
    res.status(503).send()
  }
})

// For session setup
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: "http://127.0.0.1:3000/auth/github/callback"
},
  function (accessToken, refreshToken, profile, done) {

    // To keep the example simple, the user's GitHub profile is returned to
    // represent the logged-in user.  In a typical application, you would want
    // to associate the GitHub account with a user record in your database,
    // and return that user instead.
    console.log("profile ", profile.id);
    appdata[profile.id] = { rows: [] };
    return done(null, profile.id);
  }
));

async function run() {
  await client.connect()
  collection = await client.db("a3").collection("data")
  app.set('views', __dirname + '/public');
  app.set('view engine', 'ejs');
  app.use(partials());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(express.static("public"));

  app.get('/', function (req, res) {
    res.render('login', { user: req.user });
  });

  app.get('/login', function (req, res) {
    res.render('login', { user: req.user });
  });

  app.get('/todo', ensureAuthenticated, function (req, res) {
    res.render('todo', { user: req.user });
  });

  app.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] }),
    function (req, res) {
      // The request will be redirected to GitHub for authentication, so this
      // function will not be called.
    });

  app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function (req, res) {
      res.redirect('/todo');
    });

  app.get('/logout', function (req, res) {
    req.logout(function (err) {
      if (err) return next(err);
      res.redirect('/');
    });
  });

  app.get("/data", ensureAuthenticated, handleGet);
  app.post("/add-new-data", ensureAuthenticated, express.json(), handleSubmit);
  app.post("/delete", ensureAuthenticated, express.json(), handleDelete);
  app.post("/update-box", ensureAuthenticated, express.json(), tickBox);
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

run()