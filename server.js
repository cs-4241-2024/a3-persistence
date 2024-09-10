import express from "express";
import { client } from "./db.js";

// App configuration
const app = express();
app.use(express.json());
app.use(express.static("public"));
const dir = "public/";
const port = 3000;

// App data
const appdata = [];

app.get("/data", (req, res) => {
    console.log(appdata);

    res.json(appdata);
});

app.put("/data", (req, res) => {
    const data = req.body;
    const { index, ...rest } = data;
    // Derived value
    rest.total = data.price * data.quantity;
    aappdata[index] = rest;
    res.send("Data updated successfully");
});

app.post("/data", (req, res) => {
    const data = req.body;

    console.log(data);

    // Derived value
    data.total = data.price * data.quantity;
    appdata.push(data);

    console.log(appdata);

    res.send("Data updated successfully");
});

app.delete("/data", (req, res) => {
    const data = req.body;
    const { index } = data;
    appdata.splice(index, 1);
    res.send("Data deleted successfully");
});

const startServer = async () => {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
    );

    app.listen(port, async () => {
        console.log(`Listening on http://localhost:${port}`);
        console.log(client.db("sample_mflix").collection("movies").find());
    });
};

startServer();

process.on("exit", async () => {
    setTimeout(async () => {
        await client.close();
    }, 1000);
});
