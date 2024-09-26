// const http       = require("http");
// const fs         = require("fs");
// const mime       = require("mime");
const express    = require("express");
const cookie     = require("cookie-session");
const handlebars = require("express-handlebars").engine;

// Project function imports
const {cookieKey1, cookieKey2} = require("./private.js");
const
{
  DB_CreateCollection,
  DB_CreateDocument,
  DB_UpdateDocument,
  DB_DeleteDocument,
  DB_FindDocuments,
} = require("./database.js");

// Local directory
const dir  = "public/";

// Server port
const port = 3000;

// Setup express
const app = express();
app.engine("handlebars", handlebars(
  {
    layoutsDir: "./views/layouts"
  })
);
app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "handlebars");
app.set("views", "./views");

// Setup cookies
app.use
(
  cookie
  ({
    name: 'session',
    keys: [cookieKey1, cookieKey2],
    SameSite: "None"
  })
);

// Data table for active laptop loans
let activeLoans = 
[
  {"id": -1, "firstname": "placeholder", "lastname": "placeholder", "dup":false},

  // Example loans
  {"id": 2, "firstname": "John", "lastname": "Smith", "dup":false},
  {"id": 9, "firstname": "Matthew", "lastname": "Stinson", "dup":false},
  {"id": 14, "firstname": "Jess", "lastname": "Stairs", "dup":false},
  {"id": 15, "firstname": "Austin", "lastname": "Murphy", "dup":false},
  {"id": 20, "firstname": "matthew", "lastname": "stinson", "dup":false},
]

/**
 * Formats a log message to include message source.
 * 
 * @param {string} src Message source.
 * @param {string} message Base log message.
 * @returns Formatted log message.
 */
const formatLog = function(src, message)
{
  return `[${src.toUpperCase()}] → ${message}`;
}

// POST login handler
app.post("/login", async (request, response) =>
{
  const result = await DB_FindDocuments({user: request.body.user}, "logins");

  if (result.length === 0)
  {
    if (request.body.user === "logins")
    {
      request.session.login = false;
      request.session.username = "--";
  
      response.status(422).send("Illegal Username");
      return;
    }

    await DB_UpdateDocument({user: request.body.user, pass: request.body.pass}, "logins");
    await DB_CreateCollection(request.body.user);

    request.session.login = true;
    request.session.username = request.body.user;

    console.log(formatLog("SERVER", `New account created for \"${request.session.username}\"`));
    response.render("main", {layout: "index", bodyscript: "main.js"});
  }
  else if (result.length === 1)
  {
    if (request.body.user === "logins")
    {
      request.session.login = false;
      request.session.username = "--";
  
      response.status(422).send("Illegal Username");
      return;
    }

    if (result[0].pass === request.body.pass)
    {
      request.session.login = true;
      request.session.username = request.body.user;

      // response.render("index", {loginmsg: `Logged in as ${request.body.user}`, layout: false});
      console.log(formatLog("SERVER", `Logged in as ${request.body.user}`));
      response.render("main", {layout: "index", bodyscript: "main.js"});
    }
    else
    {
      request.session.login = false;
      request.session.username = "--";

      response.status(422).send("Invalid Password");
    }
  }
  else if (result.length > 1)
  {
    request.session.login = false;
    request.session.username = "--";

    response.status(423).send("Multiple Users Exist in System");
  }
});

// Send unauthenticated user to login
app.use(function(request, response, next)
{
  if (request.session.login === true)
  {
    next();
  }
  else
  {
    // console.log("NOT LOGGED IN :(");
    response.render("login", {layout: "index", bodyscript: "login.js"});
  }
});

// General GET request handler
app.get("/", (request, response) =>
{
  if (request.session.login === true)
  {
    response.render("main", {layout: "index", bodyscript: "main.js"});
  }
  else
  {
    response.render("login", {layout: "index", bodyscript: "login.js"});
  }
});

// GET table handler
app.get("/table", async (request, response) =>
{
  // TODO: DB_GetCollection
  // response.send(activeLoans);

  const table = await DB_FindDocuments({}, request.session.username);
  response.send(table);
});

// POST submit handler
app.post("/submit", async (request, response) =>
{
  const laptopID = parseInt(request.body.id);
  if (isNaN(laptopID) || laptopID < 0)
  {
    response.status(422).send("Invalid ID");
  }
  else
  {
    // TODO: Get user from login session
    request.body.id = parseInt(request.body.id);
    await DB_UpdateDocument(request.body, request.session.username);
    await duplicatesCheck(request);

    response.end("All good pardner");
  }
});

// POST submit handler
app.post("/remove", async (request, response) =>
{
  const laptopID = parseInt(request.body.id);

  await DB_DeleteDocument(request.body, request.session.username);
  await duplicatesCheck(request);
  response.end("Yippee");
});

// POST logout handler
app.post("/logout", async (request, response) =>
  {
    request.session.login = false;
    request.session.username = "";
    response.render("login", {layout: "index", bodyscript: "login.js"});
  });

app.use((error, request, response, next) =>
{
  console.error(error.stack);
  response.status(500).send('Error :/');
});

const duplicatesCheck = async function(request)
{
  const collection = await DB_FindDocuments({}, request.session.username);

  for (let baseRow = 0; baseRow < collection.length; baseRow++)
  {
    let match = false;

    for (let checkRow = 0; checkRow < collection.length; checkRow++)
    {
      if (baseRow !== checkRow)
      {
        match |= (collection[baseRow].firstname.toLowerCase() === collection[checkRow].firstname.toLowerCase() &&
                  collection[baseRow].lastname.toLowerCase() === collection[checkRow].lastname.toLowerCase());

        if (match == true)
        {
          break;
        }
      }
    }

    collection[baseRow].dup = Boolean(match);
    await DB_UpdateDocument(collection[baseRow], request.session.username);
  }
}

// Start server on port
app.listen(process.env.PORT || port);
console.log(formatLog("SERVER", `Server running on port ${port}`));
