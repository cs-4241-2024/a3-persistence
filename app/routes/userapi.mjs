import express from "express";
import conn from "../database/mongodb.mjs";
import User from "../models/User.model.js"
import Score from "../models/Score.model.js"
import * as bodyParser from "express";
const userrouter = express.Router();
userrouter.get("/", async (req, res) => {
    const scores = await User.find({});
    console.log(scores)
    res.status(200).json(scores)
});
// Add a new document to the collection
userrouter.post("/login", async (req, res) => {
    console.log(req.body)
    const {username, password} = req.body;
    try {
        const usernameExists = await User.findOne({ username });
        if(usernameExists && password === usernameExists.password) {
            res.status(200);
            res.json({username: usernameExists.username, shortname: usernameExists.shortname});
        } else {
            res.status(400)
        }
    } catch(error) {
        console.error(error);
    }
    res.send();
});
userrouter.post("/register", async (req, res) => {
    console.log(req.body)
    const {shortname, username, password} = req.body;
    console.log({shortname: shortname, username : username, password : password})
    const newUser = new User({shortname: shortname, username : username, password : password});
    console.log(newUser)
    try {
        const usernameExists = await User.findOne({ username });
        if(usernameExists) {
            res.status(400);
            throw new Error("Username already exists");
        } else {
            newUser.save();
            res.body = req.body;
            res.status(200)
        }
    } catch(error) {
        console.error(error);
    }
    res.send();




});
export default userrouter;

/*
import express from "express";
import conn from "../database/mongodb.mjs";
import { ObjectId } from "mongodb";
const Score = require("../models/Score.model")
const router = express.Router();

// Get a list of 50 posts
router.get("/", async (req, res) => {
    let collection = await db.collection("posts");
    let results = await collection.find({})
        .limit(50)
        .toArray();

    res.send(results).status(200);
});

// Fetches the latest posts
router.get("/latest", async (req, res) => {
    let collection = await db.collection("posts");
    let results = await collection.aggregate([
        {"$project": {"author": 1, "title": 1, "tags": 1, "date": 1}},
        {"$sort": {"date": -1}},
        {"$limit": 3}
    ]).toArray();
    res.send(results).status(200);
});

// Get a single post
router.get("/:id", async (req, res) => {
    let collection = await db.collection("posts");
    let query = {_id: ObjectId(req.params.id)};
    let result = await collection.findOne(query);

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

// Add a new document to the collection
router.post("/", async (req, res) => {
    let collection = await db.collection("posts");
    let newDocument = req.body;
    newDocument.date = new Date();
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
});

// Update the post with a new comment
router.patch("/comment/:id", async (req, res) => {
    const query = { _id: ObjectId(req.params.id) };
    const updates = {
        $push: { comments: req.body }
    };

    let collection = await db.collection("posts");
    let result = await collection.updateOne(query, updates);

    res.send(result).status(200);
});

// Delete an entry
router.delete("/:id", async (req, res) => {
    const query = { _id: ObjectId(req.params.id) };

    const collection = db.collection("posts");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
});

export default router;*/
