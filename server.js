const express = require("express"),
      { MongoClient, ObjectId } = require("mongodb"),
      app = express()

app.use(express.static("public") )
app.use(express.urlencoded({ extended:true }))
app.use(express.json())

const uri = `mongodb+srv://snaik5:AoHeBSM0lvyrIWeo@cluster0.nc6as.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
const client = new MongoClient( uri )

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("workout").collection("workoutLogs")
  
}

run()


app.get("/gets", async (req, res) => {
  if (collection !== null) {
    const docs = await collection.find({}).toArray()
    res.json( docs )
  }
})

app.get("/", async (req, res) => {
  res.sendFile( res, 'public/index.html' );
})


app.post( '/submit', async (req,res) => {
  
  const [shr, smin] = req.body.stime.split(":"),
          [ehr, emin] = req.body.etime.split(":"),
          hr = ehr - shr,
          min = emin - smin,
          t = hr * 60 + min;
  req.body.time = t
  

  const result = await collection.insertOne( req.body )
  
  console.log(result)
  
  res.json( result )
})

app.post( '/delete', async (req,res) => {
  const result = await collection.deleteOne({ 
    _id:new ObjectId( req.body._id ) 
  })
  
  res.json( result )
})


app.post( '/save', async (req,res) => {
  
  const [shr, smin] = req.body.stime.split(":"),
          [ehr, emin] = req.body.etime.split(":"),
          hr = ehr - shr,
          min = emin - smin,
          t = hr * 60 + min;
  
  console.log(req.body)
  const result = await collection.updateOne(
    {_id: new ObjectId(req.body._id)},
    { $set:{ workout:req.body.workout,
           date:req.body.date,
           stime:req.body.stime,
           etime:req.body.etime,
           time:t
           } 
    }
  )

  res.json( result )
})



app.listen(3000)

