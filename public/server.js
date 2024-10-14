require('dotenv').config()
const express = require( 'express' ),
    cookie  = require( 'cookie-session' ),
    { MongoClient, ObjectId } = require("mongodb"),
    app = express()

app.use( express.static( 'public' , {index: '/login.html' } ) )
app.use( express.urlencoded({ extended:true }) )
app.use( express.json() )
app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient( uri )

let equations = null
let loginData = null

// app.use( (req,res,next) => {
//   if( req.session.login === true )
//     next()
//   else
//     res.sendFile( __dirname + '/login.html' )
// })

app.post( '/login', async (req,res) => {
  console.log( req.body )
  let username = req.body.user
  let password = req.body.pass
  let login = await loginData.findOne({user: username, pass: password})

  if (login === null || login.user !== username || login.pass !== password) {
    await loginData.insertOne( req.body )
  }
  req.session.user = username
  req.session.login = true
  res.redirect( "/index.html" )
})

app.post('/logout', ( req, res ) => {
  req.session = null
  res.redirect( "/" )
})

app.post( '/add', async (req,res) => {
  equation = req.body
  equation.owner = req.session.user
  const result = await equations.insertOne( equation )
  equation._id = result.insertedId
  res.status( 200 ).send( equation._id )
})

app.post( '/remove', async (req,res) => {
  const result = await equations.deleteOne({_id: new ObjectId( req.body.id )})
  res.status( 200 ).send( result )
})

app.post( '/update', async (req,res) => {
  const result = await calculator.updateOne(
    { _id: new ObjectId( req.body._id ) },
    { $set:{ name:req.body.name } }
  )

  res.json( result )
})

app.post( '/table', async (req,res) => {
  if(!req.session.isPopulated) {
    return res.status(400).send( "user not logged in" )
  }
  const table = await equations.find({owner: req.session.user}).toArray()
  res.status( 200 ).send( table )
})

async function run() {
  await client.connect()
  equations = await client.db("calculator").collection("equation")
  loginData = await client.db("calculator").collection("logins")

  app.get("/docs", async (req, res) => {
    if (equations !== null) {
      const docs = await equations.find({}).toArray()
      res.json( docs )
    }
  })
}

run()

app.listen(3000)