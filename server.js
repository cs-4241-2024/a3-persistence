const express = require('express');
const path = require('path');
const { MongoClient, ServerApiVersion } = require('mongodb');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

const uri = "mongodb+srv://jeffreycuili:AerobicBase123@jeffcli-a3.kx4gs.mongodb.net/?retryWrites=true&w=majority&appName=jeffcli-a3";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let usersCollection, todosCollection;

async function connectToDatabase() {
    try {
        await client.connect();
        const database = client.db('todoApp');
        usersCollection = database.collection('users');
        todosCollection = database.collection('todos');
        console.log("Connected to MongoDB!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

connectToDatabase();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    async function(username, password, done) {
        try {
            const user = await usersCollection.findOne({ username });
            if (!user) return done(null, false, { message: 'No user with that username' });
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return done(null, false, { message: 'Password incorrect' });
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(async function(id, done) {
    try {
        const user = await usersCollection.findOne({ _id: id });
        done(null, user);
    } catch (error) {
        done(error);
    }
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    console.log('Received data:', { username, password });

    if (!username || !password) {
        console.error('Username and password are required');
        return res.status(400).json({ message: 'Username and password required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await usersCollection.insertOne({ username, password: hashedPassword });
        console.log('User registered:', result);
        res.status(201).send('User registered');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user');
    }
});

app.post('/login', passport.authenticate('local'), (req, res) => {
    res.status(200).send('Logged in');
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.get('/data', async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send('Unauthorized');
    try {
        const todos = await todosCollection.find({ userId: req.user._id }).toArray();
        res.json(todos);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/data', async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send('Unauthorized');
    try {
        const newItem = req.body;
        newItem.userId = req.user._id;
        await todosCollection.insertOne(newItem);
        const todos = await todosCollection.find({ userId: req.user._id }).toArray();
        res.json(todos);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.delete('/data/:id', async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send('Unauthorized');
    try {
        const id = req.params.id;
        await todosCollection.deleteOne({ _id: id, userId: req.user._id });
        const todos = await todosCollection.find({ userId: req.user._id }).toArray();
        res.json(todos);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.put('/data', async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send('Unauthorized');
    try {
        const updatedItem = req.body;
        await todosCollection.updateOne({ _id: updatedItem._id, userId: req.user._id }, { $set: updatedItem });
        const todos = await todosCollection.find({ userId: req.user._id }).toArray();
        res.json(todos);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(process.env.PORT || port, () => {
    console.log(`Server is running on port ${process.env.PORT || port}`);
});