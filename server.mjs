import scorerouter from "./app/routes/scoreapi.mjs"
import http from "http";
import * as fs from "fs";
import mime from "mime";
import serve from 'serve-static'
import express from "express";
import cors from 'cors';
import * as bodyParser from "express";
import userrouter from "./app/routes/userapi.mjs";

      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
const dir  = 'src/',
      port = 3000,
      app = express()

const logger = (req,res,next) => {
    console.log( 'url:', req.url )
    next()
}
app.use( express.static(dir) )

app.get("/", (req, res) =>{
    res.sendFile( __dirname + '/public/index.html' )
})
app.use(logger)

app.use(cors());
app.use(express.json());
app.use("/user", userrouter)
app.use("/score", scorerouter)




app.listen( process.env.PORT || 3000 )




