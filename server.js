require('dotenv').config();

const express = require('express'),
    port = 3000,
    app = express(),
    mongoose = require('mongoose');

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}/a3-persistence?retryWrites=true&w=majority&appName=a3-persistence`;
const clientOptions = {serverApi: {version: '1', strict: true, deprecationErrors: true}};

const userSchema = new mongoose.Schema({
    username: String,
    password: String
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

    app.use(express.static('public'));

    app.get('/', (req, res) => {
        res.sendFile("public/index.html");
    });

    app.get("/getEvents", express.json(), async (req, res) => {
        console.log("Sending events");
        const user = await User.find({"username": "bcspe"}, "_id");
        const events = await Event.find({user: user}).exec();
        console.log(events);
        res.send(events);
    });

    app.post("/addEvent", express.json(), async (req, res) => {
        let event = req.body;
        console.log(`Add event: ${JSON.stringify(event)}`);
        event = calc_depart(event);
        let new_event = await new Event(event).save();
        console.log(JSON.stringify(new_event));
        res.send(new_event);
    });

    app.put("/updateEvent", express.json(), async (req, res) => {
        let event = req.body;
        console.log(`Update event: ${JSON.stringify(event)}`);
        event = calc_depart(event);
        let new_event = await Event.replaceOne({_id: event._id}, event).exec();
        console.log(JSON.stringify(event));
        res.send(event);
    });

    app.delete("/deleteEvent", express.json(), async (req, res) => {
        let event = req.body;
        console.log(`Delete event: ${JSON.stringify(event)}`);
        await Event.deleteOne({_id: event._id}).exec();
    });

    app.listen(process.env.PORT || port);
}

run().catch(async (err) => {
    console.error(err);
    await mongoose.disconnect();
});
