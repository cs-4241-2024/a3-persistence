const express = require('express');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');

// Initialize express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, 'public'), { index: false })); // Serve static files without auto-indexing
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // For handling JSON requests
app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection string
const mongoURI = 'mongodb+srv://zli29:1225931003l@cluster0.sa8ge.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error: ', err));

// Define User Schema and Model
const userSchema = new mongoose.Schema({
    githubId: String,
    username: String,
});

const User = mongoose.model('User', userSchema);

// Define Activity Schema and Model
const activitySchema = new mongoose.Schema({
    username: String,    // Associate the activity with the username
    activityType: String,
    details: Object
});

const Activity = mongoose.model('Activity', activitySchema);

const callbackURL = process.env.NODE_ENV === 'production'
    ? 'https://sea-lion-app-dv9ma.ondigitalocean.app/auth/github/callback'
    : 'http://localhost:3000/auth/github/callback';

// GitHub OAuth Setup
passport.use(new GitHubStrategy({
        clientID: 'Ov23li6bj5dJbJlZ9Nef',
        clientSecret: 'af2592ff2df91e57c49055058699eb03a207370c',
        callbackURL: callbackURL
        // callbackURL: 'http://localhost:3000/auth/github/callback'
    },
    async function (accessToken, refreshToken, profile, done) {
        let user = await User.findOne({ githubId: profile.id });
        if (!user) {
            user = new User({ githubId: profile.id, username: profile.username });
            await user.save();
        }
        return done(null, user);
    }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Middleware to ensure authentication
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/github');
}

// Serve login page at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));  // Serve the login page
});

// GitHub Authentication Routes
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
        req.session.username = req.user.username;
        res.redirect('/index');  // Redirect to index after successful authentication
    }
);

// Logout route
app.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.session.destroy();
        res.redirect('/');  // Redirect to the login page after logging out
    });
});

// Serve the index page for authenticated users
app.get('/index', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));  // Serve the index page only at /index
});

// Route to add an activity (User-specific)
app.post('/addActivity', ensureAuthenticated, async (req, res) => {
    const { activityType, details } = req.body;
    const username = req.session.username;  // Get the logged-in user's username

    try {
        const newActivity = new Activity({ username, activityType, details });
        await newActivity.save();
        res.json({ message: 'Activity saved successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving activity', error });
    }
});


app.get('/getActivities', ensureAuthenticated, async (req, res) => {
    const username = req.session.username;  // Get the logged-in user's username

    try {
        const activities = await Activity.find({ username });  // Fetch activities from MongoDB
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching activities', error });
    }
});

// Route to update an activity (User-specific)
app.post('/updateActivity', ensureAuthenticated, async (req, res) => {
    const { activityId, activityType, details } = req.body;
    const username = req.session.username;  // Get the logged-in user's username

    try {
        const updatedActivity = await Activity.findOneAndUpdate(
            { _id: activityId, username },
            { activityType, details },
            { new: true }  // Return the updated document
        );
        res.json({ message: 'Activity updated successfully!', activity: updatedActivity });
    } catch (error) {
        res.status(500).json({ message: 'Error updating activity', error });
    }
});

// Route to delete an activity (User-specific)
app.post('/deleteActivity', ensureAuthenticated, async (req, res) => {
    const { activityId } = req.body;
    const username = req.session.username;  // Get the logged-in user's username

    try {
        await Activity.findOneAndDelete({ _id: activityId, username });
        res.json({ message: 'Activity deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting activity', error });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});