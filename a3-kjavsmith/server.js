const express = require('express');
const session = require('express-session');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();
const uri = "mongodb+srv://kjavsmith:Welcome2Boston@cswebwarea3.trbub.mongodb.net/?retryWrites=true&w=majority&appName=CSWEBWAREA3";
const client = new MongoClient(uri);
let collection = null;

// Database connection
async function run() {
    await client.connect();
    collection = client.db("todoapp").collection("todos");
    console.log('Connected to MongoDB');
}

run().catch(console.error);

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
}));

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
};

// Routes
app.get('/', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userCollection = client.db("todoapp").collection("users");
    const user = await userCollection.findOne({ username });

    if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { username, password: hashedPassword };
        await userCollection.insertOne(newUser);
        req.session.user = newUser;
        return res.redirect('/');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
        req.session.user = user;
        res.redirect('/');
    } else {
        res.send('Invalid credentials');
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// CRUD operations for tasks
app.post('/add', isAuthenticated, async (req, res) => {
    const { task, priority, deadline } = req.body;
    const newTodo = {
        task,
        priority: parseInt(priority),
        deadline,
        userId: req.session.user._id
    };
    await collection.insertOne(newTodo);
    const todos = await collection.find({ userId: req.session.user._id }).toArray();
    res.json(todos);
});

app.delete('/delete/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    await collection.deleteOne({ _id: new ObjectId(id), userId: req.session.user._id });
    const todos = await collection.find({ userId: req.session.user._id }).toArray();
    res.json(todos);
});

app.put('/update/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { task, priority, deadline } = req.body;

    await collection.updateOne(
        { _id: new ObjectId(id), userId: req.session.user._id },
        { $set: { task, priority: parseInt(priority), deadline } }
    );
    const todos = await collection.find({ userId: req.session.user._id }).toArray();
    res.json(todos);
});

app.get('/todos', isAuthenticated, async (req, res) => {
    const todos = await collection.find({ userId: req.session.user._id }).toArray();
    res.json(todos);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
