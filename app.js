const express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require('cors');
const session = require('express-session');

require("dotenv").config();



const { connect, disconnect, getDB } = require("./db")


const app = express();

// middleware

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());  // Allow all origins


app.use(
  session({
    secret: "trajanA3PersistenceSuperSecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);


app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

// Mount the indexRouter at the root path after setting session
var indexRouter = require("./routes/index");
app.use(indexRouter);

process.on("SIGINT", async () => {
  disconnect();
  process.exit(0);
});

module.exports = app;
