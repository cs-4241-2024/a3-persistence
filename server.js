const express = require('express')
const mime = require("mime");
const app = express()

app.use(express.urlencoded({ extended: false })); //url parser
app.use(express.json()) // parse data as json
const port = 3000

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
app.get('/FFtable', (req, res) => {
    res.status(200)
    res.send(appdata)
})

//get a record
app.post('/record', (req, res) => {
    let index = parseInt(req.body['index'])
    if(!isNaN(index)){
        let record = appdata[index]
        res.status(200)
        res.send(record)
    }
    else{
        res.status(404)
        res.send( 'Index not found in dataset' )
    }
    console.log(req.params)
})

//post new player (add database connection)
app.post('/submit', (req, res) => {
    let newRecord = req.body
    //check if record is valid if so add it
    if (recordIsVaild(newRecord)) {
        //calculate rDelta for newRecord
        newRecord["rDelta"] = newRecord["rPPR"]-newRecord["rDyn"]
        newRecord["id"] = nextIdNumber
        nextIdNumber++
        appdata.push(newRecord)
        res.status(200)
        res.send("Post ok")
    }
    else{
        res.status(200)
        res.send("invaild new player")
    }
})

//delete a player (add database connection)
app.post('/delete', (req, res) => {
    let idToDelete = parseInt(req.body['id'])
    console.log(idToDelete)
    console.log(req.body)

    // find player with sent id and delete
    let found = false
    for (let i =0; i<appdata.length;i++){
        if(appdata[i]['id']===idToDelete){
            appdata.splice(i,1)
            found = true
            break
        }
    }
    //send back successes if player was deleted
    if (found){
        res.status(200)
        res.send("good")
    }
    else{
        res.status(400)
        res.send("not found")
    }
})

//edit a player
app.post('/edit', (req, res) => {
    let index = parseInt(req.body['index'])
    let editedRecord = req.body['editedRecord']
    if(!isNaN(index)){
        let record = appdata[index]
        record["rDyn"] = editedRecord["rDyn"]
        record["rPPR"] = editedRecord["rPPR"]
        record["rDelta"] = editedRecord["rDelta"]
        record["name"] = editedRecord["name"]
        record["team"] = editedRecord["team"]
        record["pos"] = editedRecord["pos"]
        record["byeWeek"] = editedRecord["byeWeek"]
        record["age"] = editedRecord["age"]

        res.status(200)
        res.send('good')
    }
    else{
        res.status(404)
        res.send('edit index bad')
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

