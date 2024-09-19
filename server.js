const express = require("express"),
  { MongoClient, ObjectId } = require("mongodb"),
  cookieSession = require('cookie-session'),
  path = require('path'),
  app = express();

const uri = `mongodb+srv://rcwright03:${process.env.password}@cluster0.lrrcs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri);

let usersCollection = null;
let productsCollection = null;

async function run() {
  await client.connect();
  const db = await client.db("datatest");
  usersCollection = db.collection("users");
  productsCollection = db.collection("products");
}
run();

// Middleware to handle JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie-session middleware setup
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
}));

// Serve static files (HTML, CSS, JS) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the login page (no auth needed)
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// function called upon pressing login button
app.post('/login', async (req, res) => {
  // attach the username and password to the user variable
  const { username, password } = req.body;
  const user = await usersCollection.findOne({ username });

  if (user) {
    if (user.password === password) {
      // if username exists and the password
      // matches the username, then log in
      req.session.loggedIn = true;
      req.session.username = username;
      res.redirect('/index.html');
    } else {
      // if username exists but password is incorrect,
      // then redirect back to the login page
      res.redirect('/login.html');
    }
  } else {
    // if username doesn't exist, create a user
    // in the database with the username and password
    // then redirect the user to the entry page
    await usersCollection.insertOne({ username, password });
    req.session.loggedIn = true;
    req.session.username = username;
    res.redirect('/index.html');
  }
});

// middleware that sends unauthenticated users to the login screen
// should they reach the entry screen
app.use((req, res, next) => {
  if (req.session.loggedIn) {
    // if the user is logged into the session (if the user is
    // authenticated), then proceed
    next();
  } else {
    // if the user isn't authenticated, then redirect the
    // user to the login page
    res.redirect('/login.html');  // Redirect to login page if not authenticated
  }
});

// function for calculating the projected price of a product
function calculateCurrentCost(product) {
  let yearsOfInflation = 2024 - product.releaseYear;

  // using 1.0328 as the inflation rate since it was simple
  let inflationRate = 1.0328;
  
  let newCost = product.releaseCost;
  
  // for each year of inflation, multiply the original cost
  // by the inflation rate to get the projected cost today
  while (yearsOfInflation > 0) {
    newCost *= inflationRate;
    yearsOfInflation--;
  }
  // since it's dealing with money, set it to just 2 decimals
  product.currentCost = newCost.toFixed(2);
}

// Fetch products specific to the logged-in user
app.post('/submit', async (req, res) => {
  const { action, product, releaseYear, releaseCost } = req.body;
  const username = req.session.username;

  if (action === 'add') {
    const newProduct = {
      product,
      releaseYear: parseInt(releaseYear),
      releaseCost: parseFloat(releaseCost),
      currentCost: 0,
      username,  // associate the product with the current user
    };
    // run function to calculate projected cost since we
    // are adding a new product
    calculateCurrentCost(newProduct);
    await productsCollection.insertOne(newProduct);
    res.json({ status: 'success' });
  } else if (action === 'get') {
    const userProducts = await productsCollection.find({ username }).toArray();
    res.json(userProducts);
  } else if (action === 'delete') {
    await productsCollection.deleteOne({ product, username });
    res.json({ status: 'deleted' });
  } else if (action === 'edit') {
    // if users want to edit their product table
    const result = await productsCollection.updateOne(
      {product, username}, // find users where the username and product entered match
      { $set: {
        // editing the release year and release cost to what the user entered
          releaseYear: parseInt(releaseYear),
          releaseCost: parseFloat(releaseCost)
        }
      }
    );
    
    if (result.matchedCount > 0) {
      // product was found - update data
      const updatedProduct = await productsCollection.findOne({ product, username });
      // update the projected cost since the user edited the release year and release cost
      calculateCurrentCost(updatedProduct);
      await productsCollection.updateOne(
        { product, username },
        { $set: { currentCost: updatedProduct.currentCost } }
      );
      res.json({ status: 'success' });
    } else {
      // display error message if product cannot be found
      res.status(404).json({ status: 'error', message: 'Product not found' });
    }
  } else {
    res.status(400).send('Invalid action');
  }
});


// update product route
app.post('/update', async (req, res) => {
  const { product, releaseYear, releaseCost } = req.body;
  const username = req.session.username;

  // update the product in the database
  const result = await productsCollection.updateOne(
    { product, username },
    { $set: { releaseYear: parseInt(releaseYear), releaseCost: parseFloat(releaseCost) } }
  );

  if (result.matchedCount > 0) {
    // product was updated
    res.json({ status: 'success' });
  } else {
    // product not found
    res.status(404).json({ status: 'error', message: 'Product not found' });
  }
});

app.listen(3000)
