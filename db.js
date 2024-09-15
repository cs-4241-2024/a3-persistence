import { MongoClient, ServerApiVersion } from "mongodb";
const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cs-4241-a3.c3slf.mongodb.net/?retryWrites=true&w=majority&appName=cs-4241-a3`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

// Function to remove an element from an array by index
export function removeGroceryByIndex(username, index) {
    return client
        .db("a3")
        .collection("grocery-lists")
        .updateOne({ username: username }, [
            {
                $set: {
                    ["groceries"]: {
                        $concatArrays: [
                            { $slice: ["$groceries", index] },
                            {
                                $slice: [
                                    "$groceries",
                                    { $add: [index, 1] },
                                    { $size: "$groceries" },
                                ],
                            },
                        ],
                    },
                },
            },
        ]);
}
