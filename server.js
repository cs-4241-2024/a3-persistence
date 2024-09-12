require('dotenv').config();

const express = require("express"),
  app = express(),
  { MongoClient, ObjectId } = require("mongodb");

app.use(express.static("public"));
app.use(express.static("views"));

const uri = `mongodb+srv://server:${process.env.PASS}@${process.env.HOST}`;
const client = new MongoClient(uri);
console.log(uri);

let collection = null


app.listen(process.env.PORT || 3000);

let appdata = {
  rows:
    [

    ]
}

// Get back a JSON object with the row's data
const getRowByKey = function (key) {
  for (let row of appdata.rows) {
    // Intentionally allowing type conversion
    if (row.key == key) {
      return row;
    }
  }
  console.log("data: ", appdata);
  console.log("Bad row request. Requested key: ", key);
  return null;
}

const handleGet = async function (request, response) {
  if (collection !== null) {
    const docs = await collection.find({}).toArray()
    appdata = { rows: docs };
    for (let row of appdata.rows) {
      row.key = row._id;
    }
    response.json(appdata);
  } else {
    console.log("uh oh");
  }
};

// Sort and then send the current table
const sortAndSend = function (request, response) {
  appdata.rows.sort(function (a, b) {
    // Principally sort by done-ness
    let aint = a.done ? 1 : 0;
    let bint = b.done ? 1 : 0;
    // console.log("a.done ", a.done, " aint, ", aint, " b.done ", b.done, " bint ", bint);
    let diff = aint - bint;
    if (diff === 0) {
      // If same done-ness, sort by days left
      diff = b.daysLeft - a.daysLeft;
      // console.log("sorting by date");
      if (diff === 0) {
        // If same days left, sort alphabetically
        diff = a.task.localeCompare(b.task);
      }
    }
    return diff;
  });
  response.writeHead(200, "OK", { "Content-Type": "text/plain" });
  response.end(JSON.stringify(appdata));
};

const handleSubmit = async function (request, response) {
  console.log("handleSubmit: " + JSON.stringify(request.body));
  const requestData = request.body;
  let dateObj = new Date(requestData.due);
  let today = new Date();
  requestData.daysLeft = dateObj.getDate() - today.getDate() + 1;
  console.log("handleSubmit: today.getDate() ", today.getDate(), " dateObj.getDate() ", dateObj.getDate());

  const result = await collection.insertOne(requestData);
  requestData.key = result.insertedId.toString();
  appdata.rows.push(requestData);

  sortAndSend(request, response);
};

const handleDelete = async function (request, response) {
  const data = request.body;
  console.log("Received delete request for " + JSON.stringify(request.body));
  let idx = undefined;
  for (let i = 0; i < appdata.rows.length; i++) {
    if (appdata.rows[i].key == data.key) {
      console.log("Found row");
      idx = i;
      break;
    }
  }
  if (idx != undefined) {
    console.log("Deleting.");
    appdata.rows.splice(idx, 1);
  }

  try {
    console.log("key ", data.key);
    const result = await collection.deleteOne(
      { _id: new ObjectId(data.key) }
    )
    console.log("deleted ", result.deletedCount);
  } finally {
    sortAndSend(request, response);
  }
};

const tickBox = async function (request, response) {
  console.log("Box request, ", request.body);
  const data = request.body;
  const result = await collection.updateOne(
    { _id: new ObjectId(data.key) },
    { $set: { done: data.value } }
  )
  console.log("updated ", result.matchedCount);
  let row = getRowByKey(data.key);
  row.done = data.value;
  console.log("Set done to ", row.done);



  sortAndSend(request, response);
}

app.use((req, res, next) => {
  if (collection !== null) {
    next()
  } else {
    res.status(503).send()
  }
})

async function run() {
  await client.connect()
  collection = await client.db("a3").collection("data")

  // route to get all docs
  // app.get("/docs", async (req, res) => {
  //   if (collection !== null) {
  //     const docs = await collection.find({}).toArray()
  //     res.json(docs)
  //   }
  // })
  app.get("/data", handleGet);
  app.post("/add-new-data", express.json(), handleSubmit);
  app.post("/delete", express.json(), handleDelete);
  app.post("/update-box", express.json(), tickBox);
}

run()