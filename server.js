const express = require("express"),
  { MongoClient, ObjectId } = require("mongodb"),
  app = express(),
  passport = require("passport"),
  session = require("express-session"),
  GitHubStrategy = require("passport-github2").Strategy;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SEC,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.nc6as.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri);

let collection = null;
let userCollection = null;

async function run() {
  await client.connect();
  userCollection = await client.db("users").collection("workoutLogs");
  collection = await client.db("workout").collection("workoutLogs");
}

run();

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SEC,
      callbackURL: "https://a3-samnaik10.glitch.me/auth/github/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let user = await userCollection.findOne({ githubId: profile.id });
        if (!user) {
          const newUser = {
            githubId: profile.id,
            username: profile.username,
            // profileUrl: profile.profileUrl,
            // avatarUrl: profile.photos[0].value
          };
          const result = await userCollection.insertOne(newUser);
          user = await userCollection.findOne({ githubId: profile.id });
        }
        return done(null, user);

        // userCollection.findOrCreate({ githubId: profile.id }, function (err, user) {
        //     return done(err, user);
        // });
      } catch (err) {
        return done(err);
      }
    }
  )
);

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  function( req, res ) {
    res.redirect('/')
  }
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/auth/github" }),
  function (req, res) {
    req.session.TEST = true;
    console.log( 'AUTHENTICATED', req.user, req.session )
    res.redirect('/');
  } 
);

app.get("/logout", (req, res) => {
    console.log(req.session.TEST)

  req.session.TEST = false;
  // req.logout();
  // res.redirect('/');

  req.logout(() => {
    console.log('log out')
        console.log(req.session.TEST)
    
    if (req.session.TEST === undefined){
      res.redirect("/");
    }
  });
});

function ensureAuthentication(req, res, next) {
  console.log( 'checking authentication:', req.user, req.session.TRUE )
  if (req.session.TEST) {
    return next();
  }
  
  res.redirect("/auth/github");
}

app.get("/gets", async (req, res) => {
  if (collection !== null) {
    const docs = await collection.find({ userID: req.user.username }).toArray();
    res.json(docs);
  }
});

app.get("/", ensureAuthentication, (req, res) => {
  console.log('sending index')
  // res.sendFile( 'public/index.html' );
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/submit", async (req, res) => {
  const [shr, smin] = req.body.stime.split(":"),
    [ehr, emin] = req.body.etime.split(":"),
    hr = ehr - shr,
    min = emin - smin,
    t = hr * 60 + min;
  req.body.time = t;
  req.body.userID = req.user.username;

  const result = await collection.insertOne(req.body);

  res.json(result);
});

app.post("/delete", async (req, res) => {
  const result = await collection.deleteOne({
    _id: new ObjectId(req.body._id),
  });

  res.json(result);
});

app.post("/save", async (req, res) => {
  const [shr, smin] = req.body.stime.split(":"),
    [ehr, emin] = req.body.etime.split(":"),
    hr = ehr - shr,
    min = emin - smin,
    t = hr * 60 + min;

  const result = await collection.updateOne(
    { _id: new ObjectId(req.body._id) },
    {
      $set: {
        workout: req.body.workout,
        date: req.body.date,
        stime: req.body.stime,
        etime: req.body.etime,
        time: t,
        userId: req.user.username
      },
    }
  );

  res.json(result);
});

app.use(express.static("public"));


app.listen(3000);
