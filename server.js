require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
const client = new MongoClient(uri);

let collection = null;

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    // Ping the database
    const adminDb = client.db().admin();
    const pingResult = await adminDb.command({ ping: 1 });
    console.log("Ping result:", pingResult);

    collection = await client.db("proj3").collection("CS4241");

    // Middleware to check connection
    app.use((req, res, next) => {
      if (collection !== null) {
        next();
      } else {
        res.status(503).send();
      }
    });

    // Serve the main page
    app.get('/', (req, res) => {
      res.sendFile(__dirname + '/public/index.html');
    });

    // Serve app data
    app.get('/data', async (req, res) => {
      try {
        const appdata = await collection.find({}).toArray();
        console.log("All objects in the database:", appdata); // Log all objects
        res.json(appdata);
      } catch (err) {
        console.error("Retrieval error:", err); // Log any errors
        res.status(500).send(err);
      }
    });

    // Add new data
    app.post('/submit', async (req, res) => {
      try {
        const data = req.body;
        console.log('Received data:', data); // Log the received data
        const result = await collection.insertOne(data);
        console.log('Insert result:', result); // Log the result
        res.json(result);
      } catch (err) {
        console.error('Insert error:', err); // Log any errors
        res.status(500).send(err);
      }
    });

    // Update existing data
    app.post('/update', async (req, res) => {
      try {
        const { _id, name, points, score, difficulty } = req.body; // Extract data from the request body
        console.log('Received data for update:', req.body); // Log the received data
        const result = await collection.updateOne(
            { _id: new ObjectId(_id) },
            { $set: { name, points, score, difficulty } }
        );
        console.log('Update result:', result); // Log the result
        res.json(result);
      } catch (err) {
        console.error('Update error:', err); // Log any errors
        res.status(500).send(err);
      }
    });

    // Delete data
    app.post('/remove', async (req, res) => {
      try {
        const { _id } = req.body; // Extract _id from the request body
        console.log('Received _id for deletion:', _id); // Log the received _id
        const result = await collection.deleteOne({ _id: new ObjectId(_id) });
        console.log('Delete result:', result); // Log the result
        res.json(result);
      } catch (err) {
        console.error('Delete error:', err); // Log any errors
        res.status(500).send(err);
      }
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}/`);
    });
  } catch (err) {
    console.error(err);
  }
}

run();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Log all requests
app.use((req, res, next) => {
  console.log('url:', req.url);
  next();
});