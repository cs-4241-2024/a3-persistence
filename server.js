require('dotenv').config();

const express = require('express'),
    port = 3000,
    app = express(),
    path = require('node:path'),
    { MongoClient, ObjectId } = require('mongodb'),
    cookie = require('cookie-session');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use(cookie({
    name: 'session',
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
let client = new MongoClient(uri);
let db, usersCollection, gamesCollection;

async function connectDB() {
    try {
        await client.connect();
        db = await client.db('Celtics_Game_Tracker');
        usersCollection = db.collection('User');
        gamesCollection = db.collection('Games');
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}

connectDB()

app.post('/login', async (req, res) => {
    try {
        console.log(req.body);
        let user = await usersCollection.findOne({ name: req.body.username });
        console.log(user);
        if (!user) {
            let newUser = await usersCollection.insertOne(req.body);
            req.session.user = newUser.username;
            return res.json({ success: true, message: 'New account created' });
        } else if (user.password === req.body.password) {
            req.session.user = newUser.password;
            res.redirect(303, '/');
        } else {
            res.sendStatus(403);
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Error during login");
    }
});

app.post('/logout', (req, res) => {
    req.session = null;
    res.send("Logged out");
});

app.use((req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.sendFile('/index.html', { root: path.join(__dirname, 'public') });
    }
});

app.get("/getGames", async (req, res) => {
    try {
        const games = await gamesCollection.find({ user: ObjectId(req.session.user) }).toArray();
        res.json(games);
    } catch (error) {
        console.error("Error getting games:", error);
        res.status(500).send("Error getting games");
    }
});

app.post("/addGame", async (req, res) => {
    try {
        const game = {
            opponent: req.body.opponent,
            gameDate: new Date(req.body.gameDate),
            location: req.body.location,
            user: ObjectId(req.session.user)
        };
        const newGame = await gamesCollection.insertOne(game);
        res.json(newGame.ops[0]);
    } catch (error) {
        console.error("Error adding game:", error);
        res.status(500).send("Error adding game");
    }
});

app.put("/updateGame", async (req, res) => {
    try {
        const updatedGame = await gamesCollection.findOneAndUpdate(
            { _id: ObjectId(req.body._id), user: ObjectId(req.session.user) },
            { $set: req.body },
            { returnOriginal: false }
        );
        res.json(updatedGame.value);
    } catch (error) {
        console.error("Error updating game:", error);
        res.status(500).send("Error updating game");
    }
});

app.delete("/deleteGame", async (req, res) => {
    try {
        await gamesCollection.deleteOne({ _id: ObjectId(req.body._id), user: ObjectId(req.session.user) });
        res.send("Game deleted");
    } catch (error) {
        console.error("Error deleting game:", error);
        res.status(500).send("Error deleting game");
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});