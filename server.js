const express = require ("express");
const app = express();
const port = 3000;

app.use(express.static('public'))
app.use(express.json());

app.use(express.urlencoded({extended: true})); // gets data sent by defaut form actions

// app.use applies whatever function in the parenthesis to every request

app.listen( process.env.PORT || port );

let appdata = [] // name price quantity total
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

// get login page
// app.get("/", (req, res) => {
//   res.sendFile("login.html", { root: "public" });
// });


// get main HTML page
app.get("/", (req, res) => {
  res.sendFile("index.html")
});


// GET request for results
app.get('/results', (req, res) => {
  if (validateForm) {
    res.json(appdata);
    console.log("Results updated.");
  }
  else {
    console.log("Results failed to update. Please check your inputs.");
  }
});


let nextId = 1;
app.post('/', (req, res) => { // POST request to add new item
  if (validateForm) {
    const newEntry = { ...req.body, id: nextId++ };
    newEntry.total = newEntry.price * newEntry.quantity;
    appdata.push(newEntry);
    res.status(201).json(appdata);
    console.log("Item added.");
  }
  else {
    console.log("Failed to add item. Please check your inputs.");
  }

  
});


app.delete('/remove/:id', (req, res) => { // DELETE request
  const id = parseInt(req.params.id, 10);
  appdata = appdata.filter(entry => entry.id !== id);
  res.json(appdata);
  console.log(`Deleting entry with ID: ${id}`);
});

app.put("/update/:id", async (req, res) => { // PUT request (for editing)
  const id = parseInt(req.params.id, 10);
  const entryIndex = appdata.findIndex(entry => entry.id === id);

  if (entryIndex === -1) { // checks if findIndex failed
    return res.status(404).send('Entry not found');
  }
  
  const updatedEntry = { ...req.body, id }; // spreads the array into individual elements
  updatedEntry.total = updatedEntry.price * updatedEntry.quantity;
  appdata[entryIndex] = updatedEntry;
  
  res.json(appdata); // sending the PUT response back to server
});
