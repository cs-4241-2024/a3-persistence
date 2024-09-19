const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const { engine } = require("express-handlebars");
const session = require("express-session");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash");
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
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const db = client.db(process.env.DB_NAME);
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const db = client.db(process.env.DB_NAME);
        const usersCollection = db.collection("users");

        let user = await usersCollection.findOne({ githubId: profile.id });

        if (!user) {
          const newUser = {
            username: profile.username,
            githubId: profile.id,
            displayName: profile.displayName,
            profileUrl: profile.profileUrl,
          };

          const result = await usersCollection.insertOne(newUser);
          user = newUser;
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const db = client.db(process.env.DB_NAME);
      const usersCollection = db.collection("users");

      const user = await usersCollection.findOne({ username: username });

      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }

      if (password !== user.password) {
        return done(null, false, { message: "Incorrect password." });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

app.use((req, res, next) => {
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
  res.render("login", { message: req.flash("error") });
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/");
  }
);

app.post("/edit-birthday/:id", async (req, res) => {
  const birthdayId = req.params.id;
  const { birthday } = req.body;

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

  try {
    await dataCollection.updateOne(
      { _id: new ObjectId(birthdayId) },
      {
        $set: {
          birthday: birthday,
          age: age,
          day: day,
          month: month,
          year: year,
        },
      }
    );
    res.redirect("/");
  } catch (err) {
    console.error("Error updating birthday:", err);
    res.status(500).send("Failed to update birthday.");
  }
});

app.post("/edit-name/:id", async (req, res) => {
  const birthdayId = req.params.id;
  const { name } = req.body;

  const db = client.db(process.env.DB_NAME);
  const dataCollection = db.collection("data");

  try {
    await dataCollection.updateOne(
      { _id: new ObjectId(birthdayId) },
      {
        $set: {
          name: name,
        },
      }
    );
    res.redirect("/");
  } catch (err) {
    console.error("Error updating name:", err);
    res.status(500).send("Failed to update name.");
  }
});

app.get("/", async (req, res) => {
  if (!req.user) {
    return res.redirect("/login");
  }

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
      (nextBirthday - today) / (24 * 60 * 60 * 1000)
    );

    return { ...birthdayEntry, age, daysUntilNextBirthday };
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
