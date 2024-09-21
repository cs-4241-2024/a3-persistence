const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcryptjs');

const app = express();
const port = 3000;

// MongoDB connection URI
const mongoURI = 'mongodb+srv://a:a@a3.8rvei.mongodb.net';

// Connect to MongoDB
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
let usersCollection;
let entriesCollection;

client.connect().then(() => {
    usersCollection = client.db("journalApp").collection("users");
    entriesCollection = client.db("journalApp").collection("entries");
    console.log("Connected to MongoDB");
}).catch(err => console.error("Failed to connect to MongoDB", err));

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secretJournalApp',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport local strategy for authentication
passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await usersCollection.findOne({ username });
            if (!user) return done(null, false, { message: 'Incorrect username.' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return done(null, false, { message: 'Incorrect password.' });

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await usersCollection.findOne({ _id: new ObjectId(id) });
        done(null, user);
    } catch (err) {
        done(err);
    }
});

app.get('/', (req, res) => {
    res.redirect('/login.html');
});

// Register endpoint
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: "Username already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await usersCollection.insertOne({ username, password: hashedPassword });
        res.status(201).json({ message: "User registered successfully", status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Login endpoint
app.post('/login', passport.authenticate('local', {
    successRedirect: '/index.html',
    failureRedirect: '/login.html',
    failureMessage: true
}));

// Submit entry endpoint
app.post('/submitEntry', (req, res) => {
    if (!req.isAuthenticated()) {
        console.log("User not authenticated.");
        return res.status(401).json({ message: "Unauthorized - Please log in." });
    }

    const { title, date, time, entry } = req.body;
    if (!title || !date || !time || !entry) {
        console.log("Validation failed:", req.body);
        return res.status(400).json({ message: "All fields must be filled." });
    }

    const newEntry = {
        userId: req.user._id,
        title,
        date,
        time,
        entry,
        nextEntryBefore: new Date(new Date(date + "T" + time).getTime() + 24*3600*1000)
    };

    console.log("Inserting new entry:", newEntry);
    entriesCollection.insertOne(newEntry)
        .then(result => {
            console.log("Entry inserted successfully:", result);
            res.json({ status: 'success', message: 'Entry added successfully', entry: newEntry });
        })
        .catch(err => {
            console.error('Error inserting entry:', err);
            res.status(500).json({ message: "Failed to save entry. Please try again later." });
        });
});



// Delete entry endpoint
app.post('/deleteEntry', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.body;
    try {
        const result = await entriesCollection.deleteOne({ _id: new ObjectId(id), userId: req.user._id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No entry found with that ID" });
        }
        res.json({ status: 'success', message: "Entry deleted successfully" });
    } catch (error) {
        console.error("Error deleting entry:", error);
        res.status(500).json({ message: "Failed to delete entry" });
    }
});

app.post('/updateEntry', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { id, title, date, time, entry } = req.body;
    try {
        const result = await entriesCollection.updateOne(
            { _id: new ObjectId(id), userId: req.user._id },
            { $set: { title, date, time, entry } }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "No entry found with that ID" });
        }
        res.json({ status: 'success', message: "Entry updated successfully" });
    } catch (error) {
        console.error("Error updating entry:", error);
        res.status(500).json({ message: "Failed to update entry" });
    }
});



// Logout endpoint
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login.html');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
