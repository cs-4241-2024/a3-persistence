import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { client, removeGroceryByIndex } from "./db.js";

// App configuration
const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());
app.use(
    session({ secret: "keyboard cat", resave: false, saveUninitialized: false })
);
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
// app.use(passport.authenticate("github", { session: false }));
const port = 3000;

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL,
        },
        async function (accessToken, refreshToken, profile, done) {
            console.log(profile);

            const groceryLists = client.db("a3").collection("grocery-lists");

            // Check if the user exists in the database
            const userDoc = await groceryLists.findOne({
                username: profile.username,
            });

            if (userDoc) {
                return done(null, userDoc);
            }

            // If the user does not exist, create a new document
            await groceryLists.insertOne({
                username: profile.username,
                accessToken: accessToken,
                groceries: [],
            });

            return done(null, profile);
        }
    )
);

app.get("/auth", passport.authenticate("github", { scope: ["user:email"] }));

app.get(
    "/auth/callback",
    passport.authenticate("github", { failureRedirect: "/error" }),
    function (req, res) {
        res.cookie("accessToken", req.user.accessToken);

        res.redirect("/");
    }
);

app.get("/data", async (req, res) => {
    const accessToken = req.headers.authorization.split(" ")[1];

    const groceryLists = client.db("a3").collection("grocery-lists");
    const list = await groceryLists.findOne({ accessToken: accessToken });
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

app.put("/data", async (req, res) => {
    const data = req.body;
    const { index } = data;

    const groceryLists = client.db("a3").collection("grocery-lists");
    await groceryLists.updateOne(
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
    await groceryLists.updateOne(
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

    const { index } = data;

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
