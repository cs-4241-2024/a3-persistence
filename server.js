const express = require ("express");
const app = express();
const { MongoClient, ObjectId } = require("mongodb"); // objID is for db key 
//const port = 3000;

app.use(express.static("public"))
app.use(express.json());
app.use(express.urlencoded({extended: true})); // gets data sent by defaut form actions

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient(uri) // Create a MongoClient

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("a3-database").collection("a3")
}
run()

// route to get all docs
app.get("/docs", async (req, res) => {
  // const userId = req.session.userId; // cookie & user verification?
  if (collection !== null) { // if you already connected
    const docs = await collection.find({}).toArray() // .find is a query; empty {} means to return everything in an array
    res.json(docs) // convert array into JSON for response
  }
})


// -----------------------------* Now the actual server code *-----------------------------------

// app.use applies whatever function in the parenthesis to every request

//let appdata = [] // name price quantity total
//{"name": "apple", "price": "1.00", "quantity": "5", "total": "5.00", "id":"0"}


function validateForm(x) { // severside function for handling invalid (blank) data
  //var x = document.forms["myForm"]["fname"].value;
  if (x.name == null || x.name == "") {
      alert("Name must be filled out");
      return false;
  }
  else {
    return true;
  }
}

// // get login page
// // app.get("/", (req, res) => {
// //   res.sendFile("login.html", { root: "public" });
// // });


// get main HTML page
app.get("/", (req, res) => {
  res.sendFile("index.html")
});


// // GET request for results
// app.get('/results', (req, res) => {
//   if (validateForm) {
//     res.json(appdata);
//     console.log("Results updated.");
//   }
//   else {
//     console.log("Results failed to update. Please check your inputs.");
//   }
// });


// app.post( '/add', async (req,res) => {
//   const result = await collection.insertOne( req.body )
//   res.json( result )
// })


//let nextId = 1;
app.post("/submit", async (req, res) => { // POST request to add new item
  try {
    //const userId = req.session.userId; // cookie?
    //let {name, price, quantity, total} = req.body;
    //req.body.total = req.price * req.quantity;

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
  // const newEntry = { ...req.body, id: nextId++ };
  // newEntry.total = newEntry.price * newEntry.quantity;
  // appdata.push(newEntry);
  // res.status(201).json(appdata);
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
