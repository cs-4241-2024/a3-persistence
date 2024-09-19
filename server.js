const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const session = require('express-session');
require("dotenv").config();

const app = express();
const port = 3000;
const sessionCookieName = 'userSession';
const CONNECT = process.env.DB_URI;
const KEY = process.env.SECRET;
const ID = process.env.CLIENT_ID;
const CALLBACK = process.env.CALLBACK;

// MongoDB connection URI and Database
const client = new MongoClient(CONNECT);
const dbName = 'foodordersDB';
const collectionName = 'orders';
const usersCollectionName = 'users';

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));
app.use(helmet());
app.use(morgan('tiny'));
app.use(cookieParser());
app.use(session({ secret: KEY, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


// Connect to MongoDB

let db, ordersCollection, usersCollection;
client.connect().then(() => {
  db = client.db(dbName);
  ordersCollection = db.collection(collectionName);
  usersCollection = db.collection(usersCollectionName); // Users collection
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

// Passport.js GitHub OAuth strategy
passport.use(new GitHubStrategy({
      clientID: ID,
      clientSecret: KEY,
      callbackURL: CALLBACK
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user exists in the database
        let user = await usersCollection.findOne({ githubId: profile.id });

        if (!user) {
          // If user doesn't exist, create a new one
          const newUser = {
            username: profile.username,
            githubId: profile.id,
            displayName: profile.displayName
          };
          const result = await usersCollection.insertOne(newUser);
          user = result.ops[0];
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
));

// Serialize and deserialize user instances
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// GitHub OAuth routes
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub OAuth callback route
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
  // Successful authentication, set a cookie and redirect
  res.cookie(sessionCookieName, { userId: req.user._id }, { httpOnly: true, maxAge: 3600000 }); // 1 hour expiration
  res.redirect('/');
});

// GET request to fetch all orders
app.get('/orders', passportAuthenticated, async (req, res) => {
  console.log("Hello!")
  try {
    const userId = req.user._id; // Get the userId from the session cookie
    const orders = await ordersCollection.find({ userId: new ObjectId(userId) }).toArray();
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
});

// POST request to create a new order
app.post('/submit', passportAuthenticated, async (req, res) => {
  try {
    const { name, foodName, foodPrice, quantity } = req.body;
    const userId = req.user._id; // Get the userId from the session cookie

    const newOrder = {
      userId: new ObjectId(userId), name, foodName, foodPrice, quantity
    };
    const result = await ordersCollection.insertOne(newOrder);
    const orderWithId = { ...newOrder, _id: result.insertedId };
    res.status(200).json({ message: 'Order created', order: orderWithId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
});

// PUT request to update an existing order
app.put('/edit', passportAuthenticated, async (req, res) => {
  const { id, name, foodName, foodPrice, quantity } = req.body;
  try {
    const result = await ordersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { name, foodName, foodPrice, quantity } }
    );
    if (result.matchedCount === 0) return res.status(404).json({ message: 'Order not found' });
    const updatedOrder = { _id: id, name, foodName, foodPrice, quantity };
    res.json({ message: 'Order updated', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error });
  }
});

// DELETE request to delete an order
app.delete('/delete', passportAuthenticated, async (req, res) => {
  const { id } = req.body;
  try {
    const result = await ordersCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error });
  }
});

// User Registration Route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const newUser = { username, password: hashedPassword };
    await usersCollection.insertOne(newUser);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// User Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log('Request Body:', req.body); // Debug log

  try {
    // Find the user by username
    const user = await usersCollection.findOne({ username });
    console.log('User found:', user); // Debug log

    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare the password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch); // Debug log

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Set a cookie to track the session
    res.cookie(sessionCookieName, { userId: user._id }, { httpOnly: true, maxAge: 3600000 }); // 1 hour expiration

    // Log the user in with Passport
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error logging in', error: err });
      }
      res.json({ message: 'Login successful' });
    });

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error });
  }
});

//Updated Middleware to authenticate users via cookies or GitHub
function passportAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    // If Passport has authenticated the user (GitHub or session-based)
    return next();
  } else if (req.cookies[sessionCookieName]) {
    // If user is authenticated via cookies (traditional login)
    req.user = req.cookies[sessionCookieName]; // Add userId to req.user
    return next();
  } else {
    return res.status(401).json({ message: 'Access denied. Please login.' });
  }
}

app.get('/protected', passportAuthenticated, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Logout route to clear the cookie
app.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out', error: err });
    }

    // Clear session cookie for traditional login
    res.clearCookie(sessionCookieName);

    // Destroy the session for OAuth (GitHub login)
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Error destroying session', error: err });
      }

      // Redirect to the homepage or login page after logging out
      res.redirect('/');
    });
  });
});

// Serve static files (HTML, CSS, JS)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
