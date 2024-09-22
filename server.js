// importing the required oackages
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const session = require('express-session');
const routes = require('./routes/index');
const User = require('./models/user');
const Order = require('./models/order');
require('dotenv').config()


const app = express();

const PORT = process.env.PORT || 3001;
// const username = process.env.USERNAME;
// const password = process.env.PASSWORD;
// const dbname = process.env.DBNAME;
// console.log(username, password, dbname);
const connectionURL = `mongodb+srv://skylerlin:flora1234@cluster0.hb0bf.mongodb.net/a3-skylerlin`;

// const connectionURL = `mongodb+srv://${username}:${password}@cluster0.hb0bf.mongodb.net/${dbname}`;

// Serve static files from 'public' and 'views'
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('views'));
app.use(
  session({
    secret: process.env.SECRET, // Replace with a secure secret key
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set secure: true if using HTTPS in production
      maxAge: 3600000 // 1 hour in milliseconds
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(routes);


// Oauth implementation
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL
},
  async function (accessToken, refreshToken, profile, done) {
    try {
      let user = await User.findOne({ githubId: profile.id });
      if (!user) {
        // If the user doesn't exist, create a new one
        user = new User({
          githubId: profile.id,
          username: profile.username,
          email: profile.emails ? profile.emails[0].value : null,
        });
        await user.save();
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});


app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  async (req, res) => {
    try {
      console.log(req.user);  // This will show the user object
      const userOrders = await Order.find({ _id: { $in: req.user.orders } }).exec();  // Use $in to match order IDs
      console.log(userOrders);  // Log the fetched orders

      // Create table rows for each order
      let orderRows = userOrders.map(order => `
        <tr>
          <td>${order._id}</td>
          <td>${order.name}</td>
          <td>${order.address}</td>
          <td>${order.phone}</td>
          <td>${order.taxPrice}</td>
          <td>${order.totalPrice}</td>
        </tr>
      `).join('');

      // On successful authentication
      res.send(`
        <h1>Login successful</h1>
        <p>Welcome, ${req.user.username}</p>
        <h2>Your Orders</h2>
        <table border="1" cellpadding="5">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Tax Price</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            ${orderRows.length > 0 ? orderRows : '<tr><td colspan="3">No orders found.</td></tr>'}
          </tbody>
        </table>
        <br>
        <button onclick="window.location.href='/'">Go to Homepage</button>
      `);
    } catch (err) {
      console.error(err);
      res.status(500).send('<h1>Error fetching orders</h1>');
    }
  }
);

mongoose.connect(connectionURL, {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});


// Serve index.html for root request
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Middleware for handling JSON requests
app.use(express.json());



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
