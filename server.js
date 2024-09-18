const express = require('express'),
    { MongoClient, ObjectId } = require('mongodb'),
    cookie = require('cookie-session'),
    dotenv = require('dotenv').config(),
    app = express()

// const express = require('express'),
//       app = express(),
//       cookiedata = []

// app.use(express.static('./public'))
// app.use(express.json())

app.use(express.urlencoded({ extended:true }))
app.use( express.static(__dirname + '/public') )
app.use( express.json() )

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`

const client = new MongoClient (uri)

app.use( cookie({
    name: 'session',
    keys: ['keycookie1', 'keycookie2']
}))

let collectionTwo = client.db("CookieDatabase").collection("UserPass")
//console.log(collectionTwo)

app.post( '/login', async (req,res)=> {
    //console.log( req.body )

    if(collectionTwo!== null){
        const passUser = await collectionTwo.find({username:req.body.username}).toArray()
        //console.log(passUser[0])
        if(passUser !== null){
            // console.log(passUser[0].password)
            // console.log(passUser.password)
            // console.log(req.body.password)
            if(passUser[0].password === req.body.password){
                req.session.login = true
                res.redirect( 'main.html' )
            }
        }else{
            req.session.login = false
            res.sendFile( __dirname + '/public/main.html' )
        }
    }
})


app.use( function( req,res,next) {
    if( req.session.login === true )
        next()
    else
        res.sendFile( __dirname + '/public/main.html' )
})


let collection = null

async function run() {
    await client.connect()
    collection = await client.db("CookieDatabase").collection("Cookies")
    //console.log(collection)

}
run()

app.post( '/submit', async( req, res ) => {
    const result = await collection.insertOne( req.body )
    //console.log(req.body)
    res.json( result )
    //res.writeHead( 200, { 'Content-Type': 'application/json'})
    //cookiedata.push( req.body )
    //res.end( JSON.stringify( cookiedata ) )
})


app.get('/data', async (req,res) => {
    //res.sendFile(__dirname + 'public', '/main.html')
    //console.log("collection is null")
    if (collection !== null) {
        //const passUserTest = await collectionTwo.find({username:req.body.username}).toArray()
        const docs = await collection.find({}).toArray()
        //console.log(docs[1])
        //name:req.body.name
        //console.log(docs)
        //console.log("docs:" + docs)
        res.json( docs )
    }
})

// assumes req.body takes form { _id:5d91fb30f3f81b282d7be0dd } etc.
app.delete( '/remove', async (req,res) => {
    const result = await collection.deleteOne(req.body)
    res.json( result )
})

app.put( '/update', async (req,res) => {
    const result = await collection.updateOne(
        //{ _id: new ObjectId( req.body._id ) },
        {name:req.body.name,},
        { $set:{ cookie:req.body.cookie,
                icecream:req.body.icecream,
                other:req.body.other} }
    )
    res.json( result )
})



const listener = app.listen( process.env.PORT || 3000 )

