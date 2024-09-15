const express = require('express');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const uri = "mongodb+srv://jeffreycuili:Ski2012%*@jeffcli-a3.kx4gs.mongodb.net/?retryWrites=true&w=majority&appName=jeffcli-a3";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let todosCollection;

async function connectToDatabase() {
    try {
        await client.connect();
        const database = client.db('todoApp');
        todosCollection = database.collection('todos');
        console.log("Connected to MongoDB!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

connectToDatabase();

app.get('/data', async (req, res) => {
    try {
        const todos = await todosCollection.find().toArray();
        res.json(todos);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/data', async (req, res) => {
    try {
        const newItem = req.body;
        newItem.id = new Date().getTime(); // Generate a unique ID
        newItem.due_date = calculateDueDate(newItem.priority, newItem.created_at);
        await todosCollection.insertOne(newItem);
        const todos = await todosCollection.find().toArray();
        res.json(todos);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.delete('/data/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await todosCollection.deleteOne({ id: id });
        const todos = await todosCollection.find().toArray();
        res.json(todos);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.put('/data', async (req, res) => {
    try {
        const updatedItem = req.body;
        updatedItem.due_date = calculateDueDate(updatedItem.priority, updatedItem.created_at);
        await todosCollection.updateOne({ id: updatedItem.id }, { $set: updatedItem });
        const todos = await todosCollection.find().toArray();
        res.json(todos);
    } catch (error) {
        res.status(500).send(error);
    }
});

const calculateDueDate = function (priority, createdAt) {
    const creationDate = new Date(createdAt);
    let daysToAdd;

    switch (priority) {
        case 'High':
            daysToAdd = 3;
            break;
        case 'Medium':
            daysToAdd = 7;
            break;
        case 'Low':
            daysToAdd = 14;
            break;
        default:
            daysToAdd = 0;
    }

    const dueDate = new Date(creationDate);
    dueDate.setDate(dueDate.getDate() + daysToAdd);

    return dueDate.toISOString().split('T')[0];
};

app.listen(process.env.PORT || port, () => {
    console.log(`Server is running on port ${process.env.PORT || port}`);
});