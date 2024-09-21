/*mongo db setup stuff*/

const express = require("express"),
      { MongoClient, ObjectId } = require("mongodb"),
      app = express()

app.use(express.static("public") )
app.use(express.json() )

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient( uri )

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("datatest").collection("test")

  // route to get all docs
  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json( docs )
    }
  })
}

run()

app.listen(3000)

/*end of mongodb setup stuff*/


/*test mongo connection*/
app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})


/*add a route to insert a todo*/
app.post( '/add', async (req,res) => {
  const result = await collection.insertOne( req.body )
  res.json( result )
})


/*remove a todo*/
// assumes req.body takes form { _id:5d91fb30f3f81b282d7be0dd } etc.
app.post( '/remove', async (req,res) => {
  const result = await collection.deleteOne({ 
    _id:new ObjectId( req.body._id ) 
  })
  
  res.json( result )
})


/*update a document*/
app.post( '/update', async (req,res) => {
  const result = await collection.updateOne(
    { _id: new ObjectId( req.body._id ) },
    { $set:{ name:req.body.name } }
  )

  res.json( result )
})

const path = require('path');

const password = "Password";

const previous_attempts = [];

function Attempt(correct, password_entry, num_correct_letters, correct_length) {
  this.correct = correct;
  this.password_entry = password_entry;
  this.num_correct_letters = num_correct_letters;
  this.correct_length = correct_length;
}

 app.get('/submit', function(req, res) {
   
   
   res.sendFile(path.join(__dirname, 'public/index.html'));
 });



app.post('/submit',function(req,res){
    console.log('POST parameter received are: ',req.body)
    handlePost(req, res);
})




const handlePost = function (request, response) {
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    const obj = JSON.parse(dataString);
    console.log(obj.password_entry);

    //... do something with the data here!!!
    if(obj.password_entry == password)
    { 
      
      //correct?, password_entry, num_correct_letters, correct_lenght
      const new_attempt = new Attempt("true", obj.password_entry, password.length, "yes");
      previous_attempts.push(new_attempt);
      
      //response.writeHead(200, "OK", { "Content-Type": "text/plain" });
      response.writeHead(200, "OK", { "Content-Type": "application/json" });
      
      response.end(JSON.stringify(previous_attempts));
    }
    else
    {
      let correct_length = "yes"
      let num_correct_letters = 0;
      
      if(obj.password_entry.length > password.length)
      {
        correct_length = "too_long";
      }
      else if(obj.password_entry.length < password.length)
      {
        correct_length = "too_short";
      }
      
      if(correct_length == "yes" || "too_short")
      {
        for(let i = 0; i < obj.password_entry.length; i++)
        {
          if(obj.password_entry.charAt(i) == password.charAt(i))
          {
            num_correct_letters++;
          }
        }
      }
      else
      {
        for(let i = 0; i < password.length; i++)
        {
          if(obj.password_entry.charAt(i) == password.charAt(i))
          {
            num_correct_letters++;
          }
        }
      }
      //correct?, password_entry, num_correct_letters, correct_length
      const new_attempt = new Attempt("false", obj.password_entry, num_correct_letters, correct_length);
      previous_attempts.push(new_attempt);
    
      response.writeHead(200, "OK", { "Content-Type": "application/json" });
      response.end(JSON.stringify(previous_attempts));
    }
  });
};