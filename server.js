const express = require('express')
const app = express()
const dotenv = require('dotenv').config()

const DbConnectionURL = `mongodb+srv://${process.env.DbUser}:${process.env.DbPass}@${process.env.DbURL}`
const { MongoClient, ObjectId } = require("mongodb")
const client = new MongoClient( DbConnectionURL )

app.use(express.urlencoded({ extended: false })); //url parser
app.use(express.json()) // parse data as json
const port = 3000
const Dbname="FantasyFootballPublic"

//DELETE once data base is up
const appdata = [
    { 'id':1,'rPPR': 2, 'rDyn': 2, 'rDelta': 0, "name": "CeeDee Lamb","team": "DAL", "pos" : "WR", "byeWeek" : 7, "age": 25 },
    { 'id':2,'rPPR': 3, 'rDyn': 15, 'rDelta': -12, "name": "Tyreek Hill","team": "MIA", "pos" : "WR", "byeWeek" : 6, "age": 30 },
    { 'id':3,'rPPR': 1, 'rDyn': 13, 'rDelta': -12, "name": "Christian McCaffrey","team": "SF", "pos" : "RB", "byeWeek" : 9, "age": 28 }
]
let nextIdNumber = 4

//send index html at root url
app.get('/', (req, res) => {
    res.sendFile('/public/index.html', {root: __dirname})
})

//send back fantasy football data from database (will need to change this to be by user)
app.get('/FFtable', async (req, res) => {
    try{
        await client.connect()
        let playersTable = await client.db(Dbname).collection("Players")
        let players = await playersTable.find({}).toArray()
        res.status(200)
        res.send(players)
    }catch (e){
        console.log(e)
    }
    // res.status(200)
    // res.send(appdata)
})

//get a record
app.post('/record', async (req, res) => {
    try {
        let dbId = req.body['dbId']
        await client.connect()
        let playersTable = await client.db(Dbname).collection("Players")
        let foundPlayer = await playersTable.findOne({_id: new ObjectId(dbId) })
        if(foundPlayer){
            res.status(200)
            res.send(foundPlayer)
        }
        else{
            res.status(400)
            res.send('not found in db')
        }
    } catch (e) {
        res.status(404)
        res.send('error connecting to db')
    }

})

//post new player
app.post('/submit', async (req, res) => {
    let newRecord = req.body
    //check if record is valid if so add it
    if (recordIsVaild(newRecord)) {
        //calculate rDelta for newRecord
        newRecord["rDelta"] = newRecord["rPPR"]-newRecord["rDyn"]
        //add to database
        await client.connect()
        let playersTable = await client.db(Dbname).collection("Players")
        await playersTable.insertOne(newRecord)
        res.status(200)
        res.send("Post ok")
    }
    else{
        res.status(200)
        res.send("invaild new player")
    }
})

//delete a player (add database connection)
app.post('/delete', async (req, res) => {
    try {
        let dbId = req.body['dbId']
        await client.connect()
        let playersTable = await client.db(Dbname).collection("Players")

        let deleteResult = await playersTable.deleteOne({_id: new ObjectId(dbId)})
        if (deleteResult) {
            res.status(200)
            res.send("delete done")
        } else {
            res.status(400)
            res.send('delete faild: not found in db')
        }
    } catch (e) {
        res.status(404)
        res.send('error connecting to db')
    }
})

//edit a player
app.post('/edit', async (req, res) => {
    try {
        let dbId = req.body['dbId']
        let editedRecord = req.body['editedRecord']
        await client.connect()
        let playersTable = await client.db(Dbname).collection("Players")
        let updateScheme = {
            $set: {
                rDyn:editedRecord["rDyn"],
                rPPR:editedRecord["rPPR"],
                rDelta:editedRecord["rDelta"],
                name:editedRecord["name"],
                team:editedRecord["team"],
                pos:editedRecord["pos"],
                byeWeek:editedRecord["byeWeek"],
                age:editedRecord["age"]
            },
        }
        let updateResult = await playersTable.updateOne({_id: new ObjectId(dbId)},updateScheme)
        if (updateResult) {
            res.status(200)
            res.send("Update done")
        } else {
            res.status(400)
            res.send('not found in db')
        }
    } catch (e) {
        res.status(404)
        res.send('error connecting to db')
    }
})

//wont need once data base is set up correctly
function recordIsVaild(newRecord){
    if(newRecord['rDyn']==null ){
        return false
    }
    if(newRecord['rPPR']==null ){
        return false
    }
    if(newRecord['name']==null || newRecord['name']===""){
        return false
    }
    if(newRecord['team']==null || newRecord['team']===""){
        return false
    }
    if(newRecord['pos']==null || newRecord['pos']===""){
        return false
    }
    if(newRecord['byeWeek']==null ){
        return false
    }
    if(newRecord['age']==null ){
        return false
    }
    return true

}

// allow all files in public to be served
app.use(express.static('public'))

//start server on port
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

