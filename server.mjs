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
app.use(cors());
app.use(express.json());
app.use("/user", userrouter)
app.use("/score", scorerouter)
app.listen(port, () => {
    console.log(`listening on port ${port}`)
})




