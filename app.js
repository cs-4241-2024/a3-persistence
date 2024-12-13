const express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();


var indexRouter = require("./routes/index");
const { connect, disconnect, getDB } = require("./db")


const app = express();

// middleware

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


// Mount the indexRouter at the root path
app.use(indexRouter);


app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

process.on("SIGINT", async () => {
  disconnect();
  process.exit(0);
});

module.exports = app;
