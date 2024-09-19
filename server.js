const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const { engine } = require("express-handlebars");
const session = require("express-session");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
require("dotenv").config();

const app = express();

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}/${process.env.DB_NAME}`;
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}

app.engine("handlebars", engine({ defaultLayout: false }));
app.set("view engine", "handlebars");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: ["key1", "key2"],
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  console.log("Serializing user:", user);
  done(null, user);
});
passport.deserializeUser((user, done) => {
  console.log("Deserializing user:", user);
  done(null, user);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "https://a3-mkneuffer.glitch.me/auth/github/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const db = client.db(process.env.DB_NAME);
        const usersCollection = db.collection("users");

        console.log("GitHub profile:", JSON.stringify(profile, null, 2));

        let user = await usersCollection.findOne({ githubId: profile.id });

        if (!user) {
          const newUser = {
            username: profile.username,
            githubId: profile.id,
            displayName: profile.displayName,
            profileUrl: profile.profileUrl,
          };

          const result = await usersCollection.insertOne(newUser);
          console.log(`New user inserted with ID: ${result.insertedId}`);

          user = newUser;
        } else {
          console.log(`User found: ${user.username}`);
        }

        return done(null, user);
      } catch (err) {
        console.error("Error in GitHub authentication:", err);
        return done(err);
      }
    }
  )
);

app.use((req, res, next) => {
  console.log("Current route:", req.path);
  console.log("Is authenticated:", req.isAuthenticated());
  console.log("Session:", req.session);
  console.log("User:", req.user);

  if (
    req.isAuthenticated() ||
    req.path === "/login" ||
    req.path === "/auth/github" ||
    req.path.startsWith("/auth/github/")
  ) {
    next();
  } else {
    res.redirect("/login");
  }
});

app.get("/login", (req, res) => {
  console.log("Displaying login page");
  res.render("login");
});

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    console.log(
      "GitHub OAuth successful, setting session and redirecting to main"
    );
    console.log("User:", req.user);
    req.session.user = req.user;
    res.redirect("/");
  }
);

app.get("/", async (req, res) => {
  console.log("Accessing main page");
  console.log("Session:", req.session);
  console.log("User:", req.user);

  if (!req.user) {
    console.log("No authenticated user, redirecting to login");
    return res.redirect("/login");
  }

  console.log(`User is logged in: ${req.user.username}`);
  const db = client.db(process.env.DB_NAME);
  const dataCollection = db.collection("data");

  const birthdays = await dataCollection
    .find({ userId: req.user._id })
    .toArray();

  const today = new Date();
  const formattedBirthdays = birthdays.map((birthdayEntry) => {
    const birthDate = new Date(birthdayEntry.birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    const nextBirthday = new Date(
      today.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate()
    );
    if (today > nextBirthday) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const daysUntilNextBirthday = Math.ceil(
      (nextBirthday - today) / (1000 * 60 * 60 * 24)
    );

    return {
      ...birthdayEntry,
      age,
      daysUntilNextBirthday,
    };
  });

  res.render("main", {
    username: req.user.username,
    birthdays: formattedBirthdays,
  });
});

app.post("/form", async (req, res) => {
  const { name, birthday } = req.body;

  const birthDate = new Date(birthday);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  const year = birthDate.getFullYear();

  const db = client.db(process.env.DB_NAME);
  const dataCollection = db.collection("data");

  const newBirthday = {
    name,
    birthday,
    age,
    day,
    month,
    year,
    userId: req.user._id,
  };

  await dataCollection.insertOne(newBirthday);

  res.redirect("/");
});

app.post("/delete/:id", async (req, res) => {
  const db = client.db(process.env.DB_NAME);
  const dataCollection = db.collection("data");

  const birthdayId = req.params.id;

  await dataCollection.deleteOne({
    _id: new ObjectId(birthdayId),
    userId: req.user._id,
  });

  res.redirect("/");
});

app.post("/signout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
      }
      res.redirect("/login");
    });
  });
});

connectDB().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running");
  });
});
