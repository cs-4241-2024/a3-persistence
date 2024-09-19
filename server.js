require('dotenv').config();

const express = require('express'),
    port = 3000,
    app = express(),
    path = require('node:path'),
    mongoose = require('mongoose'),
    cookie = require('cookie-session');

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}/a3-persistence?retryWrites=true&w=majority&appName=a3-persistence`;
const clientOptions = {serverApi: {version: '1', strict: true, deprecationErrors: true}};

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true}
}, {versionKey: false});
const User = mongoose.model("User", userSchema);

const eventSchema = new mongoose.Schema({
    name: {type: String, default: "New Event"},
    time: {type: Date, required: true},
    travel_hrs: {type: Number, min: 0, max: 23},
    travel_mins: {type: Number, min: 0, max: 59},
    depart_time: {type: String, match: /([01]\d|2[0-3]):[0-5][0-9]/},
    user: {type: mongoose.Types.ObjectId, required: true, ref: "User"}
}, {versionKey: false});
const Event = mongoose.model("Event", eventSchema);

function calc_depart(event) {
    let time = event.time.split("T")[1].split(":").slice(0, 2)
    let depart_hr = (time[0] - event.travel_hrs) % 24;
    let depart_min = (time[1] - event.travel_mins) % 60;
    if (depart_min < 0) {
        depart_hr -= 1;
        depart_min += 60;
    }
    depart_hr = depart_hr < 0 ? depart_hr + 24 : depart_hr;
    if (depart_hr < 10) {
        depart_hr = "0" + depart_hr;
    }
    if (depart_min < 10) {
        depart_min = "0" + depart_min;
    }
    event.depart_time = depart_hr + ":" + depart_min;
    return event;
}

async function run() {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ping: 1});
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    app.use(cookie({
        secret: process.env.SESSION_SECRET
    }));

    app.use(express.static(path.join(__dirname, '/static')));

    app.post('/login', express.json(), async (req, res) => {
        console.log(req.body);
        let user = await User.findOne({'username': req.body.username});
        if(user === null) {
            user = await new User(req.body).save();
            req.session.new = true;
            req.session.user = user._id;
            console.log("Adding user");
            res.set('Content-Type', 'text/plain');
            res.send("new");
        } else if (user.password === req.body.password) {
            req.session.user = user._id;
            res.redirect(303,'/');
        } else {
            res.sendStatus(403);
        }
    });

    app.post('/logout', (req, res) => {
        console.log("Logging out")
        console.log(`Logging out ${req.session.user}`);
        req.session = null;
    });

    app.use((req, res, next) => {
        if (req.session.isPopulated) {
            console.log('User is logged in.');
            next();
        } else {
            console.log("Sending login page.")
            res.sendFile('/login.html', {root: path.join(__dirname, 'public')});
        }
    });

    app.get('/', (req, res) => {
        res.sendFile("/index.html", {root: path.join(__dirname, 'public')});
    });

    app.get("/getEvents", express.json(), async (req, res) => {
        console.log("Sending events");
        const events = await Event.find({user: req.session.user}).exec();
        console.log(events);
        res.json(events);
    });

    app.post("/addEvent", express.json(), async (req, res) => {
        let event = req.body;
        console.log(`Add event: ${JSON.stringify(event)}`);
        event = calc_depart(event);
        event.user = req.session.user;
        let new_event = await new Event(event).save();
        console.log(JSON.stringify(new_event));
        res.json(new_event);
    });

    app.put("/updateEvent", express.json(), async (req, res) => {
        let event = req.body;
        console.log(`Update event: ${JSON.stringify(event)}`);
        event = calc_depart(event);
        event.user = req.session.user;
        await Event.replaceOne({_id: event._id}, event).exec();
        console.log(JSON.stringify(event));
        res.json(event);
    });

    app.delete("/deleteEvent", express.json(), async (req, res) => {
        let event = req.body;
        console.log(`Delete event: ${JSON.stringify(event)}`);
        await Event.deleteOne({_id: event._id}).exec();
        res.end();
    });

    app.listen(process.env.PORT || port);
}

run().catch(async (err) => {
    console.error(err);
    await mongoose.disconnect();
});
