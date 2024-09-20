import express from "express";
import conn from "../database/mongodb.mjs";
import Score from "../models/Score.model.js"
import * as bodyParser from "express";
const scorerouter = express.Router();
scorerouter.post("/getall", async (req, res) => {
    console.log(req.body);
    const id = req.body.shortname;
    console.log(id)
    const scores = await Score.find().where('name').equals(id);
    console.log(scores)
    res.status(200).json(scores)
});
// Add a new document to the collection
scorerouter.post("/add", async (req, res) => {
    console.log(req.body);
    const newScore = new Score(req.body);
    console.log(newScore);
    newScore.save();
    res.body = req.body;
    res.send().status(200);
});
scorerouter.post("/update", async (req, res) => {
    console.log(req.body);
    const score = req.body.data;
    const _id = score._id;

    const response = await Score.updateOne({_id:_id}, score);

    res.body = req.body;
    res.send().status(200);
});
scorerouter.delete("/delete/:id", async (req, res)=>{
    const id = req.params.id
    const queryres = await Score.deleteOne().where('_id').equals(id);
    if (queryres.deletedCount === 1) {
        res.send().status(200)
    } else {
        res.send().status(400)
    }

});
export default scorerouter;