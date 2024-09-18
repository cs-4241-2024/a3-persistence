require('dotenv').config()
const express = require('express'),
      cookie  = require('cookie-session'),
      path = require('path'),
      { MongoClient, ObjectId } = require("mongodb"),
      app = express()

app.use(express.static('public'))
app.use(express.static('views')) 
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}`
const client = new MongoClient(uri)

app.use(function(req, res, next) {
  if (req.session.login === true || req.path === '/login' || req.path === '/index.html') {
    next()
  } else {
    res.redirect('/index.html')
  }
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.post('/login', async (req, res) => {
  console.log(req.body)
  console.log(uri)
  await client.connect()
  const database = client.db("webware").collection("users")
  const user = await database.findOne({ username: req.body.username })

  if (!user) {
    console.log('User not found')
    res.sendFile(__dirname + '/public/index.html')
  } 
  else if (user && user.password !== req.body.password) {
    console.log('Incorrect password')
    res.sendFile(__dirname + '/public/index.html')
  } 
  else {
    req.session.login = true
    req.session.username = req.body.username
    req.session.password = req.body.password
    res.redirect('/table.html')
  }
})

app.get('/api/table', async (req, res) => {
  await client.connect()
  const database = client.db("webware").collection("tables")
  const data = await database.find({username: req.session.username}).toArray()
  console.log(data[0]['table'])
  res.json({'table' : data[0]['table']})
})

app.post('/api/saveTable', async (req, res) => {
  console.log(req.body)
  await client.connect()
  const database = client.db("webware").collection("tables")
  await database.updateOne({username: req.session.username}, {$set: {table: req.body.table}})
  res.json(req.body)
})

app.listen(process.env.PORT || 3000)