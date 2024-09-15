import express from "express";
import { client, removeGroceryByIndex } from "./db.js";

// App configuration
const app = express();
app.use(express.json());
app.use(express.static("public"));
const dir = "public/";
const port = 3000;

app.get("/data", async (req, res) => {
    const groceryLists = client.db("a3").collection("grocery-lists");
    const list = await groceryLists.findOne({ username: "harbar20" });
    const groceries = list.groceries;
    const result = groceries.map((grocery, index) => {
        return {
            index,
            ...grocery,
            total: grocery.price * grocery.quantity,
        };
    });

    res.json(result);
});

app.put("/data", (req, res) => {
    const data = req.body;
    const { index } = data;

    const groceryLists = client.db("a3").collection("grocery-lists");
    const list = groceryLists.updateOne(
        {
            username: "harbar20",
        },
        {
            $set: {
                [`groceries.${index}`]: data,
            },
        }
    );

    res.send("Data updated successfully");
});

app.post("/data", async (req, res) => {
    const data = req.body;

    const groceryLists = client.db("a3").collection("grocery-lists");
    const list = await groceryLists.updateOne(
        {
            username: "harbar20",
        },
        {
            $push: {
                groceries: data,
            },
        }
    );

    res.send("Data updated successfully");
});

app.delete("/data", async (req, res) => {
    const data = req.body;

    const { index, ...rest } = data;

    removeGroceryByIndex("harbar20", index);

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
    });
};

startServer();

process.on("exit", async () => {
    setTimeout(async () => {
        await client.close();
    }, 1000);
});
