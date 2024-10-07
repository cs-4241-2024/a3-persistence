const express = require ("express");
const app = express();
const { MongoClient, ObjectId } = require("mongodb"); // objID is for db key 
const cookie = require("cookie-session");
const compression = require("compression"); // lighthouse accessibility
//const port = 3000;

app.use(compression());

app.use(express.static("public"))
app.use(express.json());
app.use(express.urlencoded({extended: true})); // gets data sent by defaut form actions

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient(uri) // Create a MongoClient

app.get("/", (req, res) => { // get login page
  res.sendFile("login.html", { root: "public" });
});

// cookie middleware; Use keys for encryption (need to change)
app.use(
  cookie({
    name: "session",
    keys: ["key1", "key2"],
  })
);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  async function registerUser() {
    try {
      const authnDB = await client.db("a3-database").collection("logins");
      const hashedPassword = password; //hash this if time
      
      const user = await authnDB.findOne({ username: username });
      if (username === user.username) { // check for duplicate username
        console.error("Error during registration; username already exists. ", error);
      }
      else {
        const result = await authnDB.insertOne({
        username: username,
        password: hashedPassword,
        });
      res.status(201).send("User registered successfully.");
      }
    } 
    catch (error) {
      console.error("Error during registration:", error);
      res.status(500).send("Registration error.");
    }
  }

  registerUser();
});


app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  async function authenticate() {
    try {
      const authnDB = await client.db("a3-database").collection("logins");
      const user = await authnDB.findOne({ username: username });
      if (user && password === user.password) {
        req.session.login = true;
        req.session.userId = user._id.toString();
        res.redirect("/main.html");
      } else {
        console.log("Incorrect credentials");
        res.redirect("/index.html");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  }

  authenticate();
});

// middleware: unauthenicaetd users get sent back to to the login page
const requireAuth = (req, res, next) => {
  if (req.session.login) {
    next();
  } else {
    res.redirect("/login.html");
  }
};

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("a3-database").collection("a3") // grab data
}
run()


// route to get all docs
app.get("/docs", async (req, res) => {
  const userId = req.session.userId; // cookie & user verification?
  if (collection !== null) { // if you already connected
    const docs = await collection.find({}).toArray() // .find is a query; empty {} means to return everything in an array
    res.json(docs) // convert array into JSON for response
  }
})


// -----------------------------* Now the actual server code *-----------------------------------

// app.use applies whatever function in the parenthesis to every request

//let appdata = [] // name price quantity total
//{"name": "apple", "price": "1.00", "quantity": "5", "total": "5.00", "id":"0"}

app.use((req, res, next) => {
  if (collection !== null) {
    next();
  } 
  else {
    res.status(503).send(); // service unavailable
  }
});

function validateForm(x) { // serverside function for handling invalid (blank) data
  //var x = document.forms["myForm"]["fname"].value;
  if (x.name == null || x.name == "") {
    alert("Name must be filled out");
    return false;
  }
  else {
    return true;
  }
}

// get main HTML page
app.get("/index.html", requireAuth, (req, res) => {
  res.sendFile("index.html")
});

// protect routes
app.use(requireAuth);


//let nextId = 1;
app.post("/submit", async (req, res) => { // POST request to add new item
  try {
    const result = await collection.insertOne({
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      total: req.body.price * req.body.quantity,
      //userId: userId,
    });
    res.status(201).json(result);
    console.log("Item added.");
  } 
  catch (error) {
    console.error("Error adding document:", error);
    res.status(500).send("Error adding document.");
  }
});


app.delete('/delete/:id', async (req, res) => { // DELETE request
  const result = await collection.deleteOne({
    _id: new ObjectId(req.params.id),
  });
  res.json(result);
  console.log("Entry successfully deleted.");
});


app.put("/update/:id", async (req, res) => { // PUT request (for editing)
  const id = req.params.id;
  //const entryIndex = appdata.findIndex(entry => entry.id === id);
  // if (entryIndex === -1) { // checks if findIndex failed
  //   return res.status(404).send('Entry not found');
  // }
  
  let {name, price, quantity, total} = req.body;
  total = req.body.price * req.body.quantity;
  console.log("id", id);
  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: {name, price, quantity, total} }
  );
  

  // const updatedEntry = { ...req.body, id }; // spreads the array into individual elements
  // updatedEntry.total = updatedEntry.price * updatedEntry.quantity;
  // appdata[entryIndex] = updatedEntry;
  
  res.json(result); // sending the PUT response back to server
});

app.listen(process.env.PORT || 3000);
