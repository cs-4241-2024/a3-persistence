import scorerouter from "./app/routes/scoreapi.mjs";
import http from "http";
import * as fs from "fs";
import express from "express";
import cors from 'cors';
import userrouter from "./app/routes/userapi.mjs";

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = process.env.PWD = process.cwd();

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
    res.sendFile( __dirname + '/src/index.html' )
})
app.use( express.static(dir) )


app.use(logger)

app.use(cors());
app.use(express.json());
app.use("/user", userrouter)
app.use("/score", scorerouter)


app.listen( process.env.PORT || port )