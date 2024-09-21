require('dotenv').config();

const express = require('express'),
      port = 3000,
      app = express(),
      path = require('node:path'),
      mongoose = require('mongoose'),
      cookie = require('cookie-session');

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}@cs4341a3.sqkz12t.mongodb.net/?retryWrites=true&w=majority`; 
const clientOptions = {serverApi: {version: '1', strict: true, deprecationErrors: true}};

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true}
}, {versionKey: false});
const User = mongoose.model("User", userSchema);

const gameSchema = new mongoose.Schema({
    opponent: { type: String, required: true },
    gameDate: { type: Date, required: true },
    location: { type: String, required: true },
    user: { type: mongoose.Types.ObjectId, required: true, ref: "User" }
}, { versionKey: false });
const Game = mongoose.model("Game", gameSchema);

async function run() {
    await mongoose.connect(uri, clientOptions);
    console.log("Connected to MongoDB successfully!");

    app.use(express.static(path.join(__dirname, '/public')));
    app.use(express.json());

    app.post('/login', express.json(), async (req, res) => {
        let user = await User.findOne({ 'username': req.body.username });
        if (user === null) {
            user = await new User(req.body).save();
            req.session.user = user._id;
            res.set('Content-Type', 'text/plain');
            res.send("new");
        } else if (user.password === req.body.password) {
            req.session.user = user._id;
            res.redirect(303, '/');
        } else {
            res.sendStatus(403);
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
            res.sendFile('/login.html', { root: path.join(__dirname, 'public') });
        }
    });

    app.get('/', (req, res) => {
        res.sendFile("/main.html", { root: path.join(__dirname, 'public') });
    });

    app.get("/getGames", async (req, res) => {
        const games = await Game.find({ user: req.session.user });
        res.json(games);
    });

    app.post("/addGame", async (req, res) => {
        const game = new Game({
            opponent: req.body.opponent,
            gameDate: new Date(req.body.gameDate),
            location: req.body.location,
            user: req.session.user
        });
        const newGame = await game.save();
        res.json(newGame);
    });

    app.put("/updateGame", async (req, res) => {
        const game = await Game.findOneAndUpdate({ _id: req.body._id, user: req.session.user }, req.body, { new: true });
        res.json(game);
    });

    app.delete("/deleteGame", async (req, res) => {
        await Game.deleteOne({ _id: req.body._id, user: req.session.user });
        res.send("Game deleted");
    });

    app.listen(3000)
}

run()