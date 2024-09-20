const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
 session({
   secret: 'secretValue', 
   resave: false,
   saveUninitialized: false,
   cookie: { secure: false }, 
 })
);
app.use(passport.initialize());
app.use(passport.session());
mongoose
 .connect('mongodb+srv://ronit:N92cBmF6HKaUb39J@cluster0.x828y.mongodb.net/myAppDb', {
   useNewUrlParser: true,
   useUnifiedTopology: true,
 })
 .then(() => console.log('MongoDB connected'))
 .catch((err) => console.error('MongoDB connection error:', err));
const UserSchema = new mongoose.Schema({
 username: String,
 password: String,
});
const User = mongoose.model('User', UserSchema);
const ScoreSchema = new mongoose.Schema({
 user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
 clicks: Number,
 date: String,
});
const Score = mongoose.model('Score', ScoreSchema);
passport.use(
 new LocalStrategy(async (username, password, done) => {
   try {
     const user = await User.findOne({ username });
     if (!user) return done(null, false, { message: 'Incorrect username' });
     const match = await bcrypt.compare(password, user.password);
     if (!match) return done(null, false, { message: 'Incorrect password' });
     return done(null, user);
   } catch (err) {
     return done(err);
   }
 })
);
passport.serializeUser((user, done) => {
 done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
 try {
   const user = await User.findById(id);
   done(null, user);
 } catch (err) {
   done(err);
 }
});
function ensureAuthenticated(req, res, next) {
 if (req.isAuthenticated()) {
   return next();
 }
 res.status(401).json({ error: 'Unauthorized' });
}
app.post('/register', async (req, res) => {
 const { username, password } = req.body;
 if (!username || !password) {
   return res.status(400).json({ error: 'Username and password are required' });
 }
 const existingUser = await User.findOne({ username });
 if (existingUser) {
   return res.status(400).json({ error: 'The username already exists' });
 }
 const hashedPassword = await bcrypt.hash(password, 10);
 const newUser = new User({
   username,
   password: hashedPassword,
 });
 try {
   await newUser.save();
   res.json({ message: 'User registred successfully' });
 } catch (error) {
   console.error('Registration error:', error);
   res.status(500).json({ error: 'Could not register user' });
 }
});
app.post('/login', (req, res, next) => {
 passport.authenticate('local', (err, user, info) => {
   if (err) {
     console.error('Authentication error:', err);
     return res.status(500).json({ error: 'An error occurred' });
   }
   if (!user) {
     return res.status(401).json({ error: 'Invalid username or password' });
   }
   req.logIn(user, (err) => {
     if (err) {
       console.error('Login error:', err);
       return res.status(500).json({ error: 'Login failed' });
     }
     return res.json({ message: 'Login successful', username: user.username });
   });
 })(req, res, next);
});
app.post('/logout', (req, res, next) => {
 req.logout(function (err) {
   if (err) {
     return next(err);
   }
   res.json({ message: 'Logged out successfully' });
 });
});

app.get('/dashboard', ensureAuthenticated, (req, res) => {
 res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});
app.post('/submit', ensureAuthenticated, async (req, res) => {
 const newScore = new Score({
   user: req.user._id,
   clicks: req.body.clicks,
   date: new Date().toLocaleString(),
 });
 try {
   await newScore.save();
   res.json(newScore);
 } catch (error) {
   res.status(500).json({ error: 'Failed to save score' });
 }
});
app.get('/highscores', ensureAuthenticated, async (req, res) => {
 try {
   const scores = await Score.find({ user: req.user._id });
   res.json(scores);
 } catch (error) {
   res.status(500).json({ error: 'Failed to fetch scores' });
 }
});

app.put('/scores/:id', ensureAuthenticated, async (req, res) => {
 try {
   const score = await Score.findOneAndUpdate(
     { _id: req.params.id, user: req.user._id },
     { clicks: req.body.clicks },
     { new: true }
   );
   if (!score) {
     return res.status(404).json({ error: 'Score not found' });
   }
   res.json(score);
 } catch (error) {
     res.status(500).json({ error: 'Failed to update score' });
 }
});
app.delete('/scores/:id', ensureAuthenticated, async (req, res) => {
 try {
   const result = await Score.deleteOne({ _id: req.params.id, user: req.user._id });
   if (result.deletedCount === 0) {
     return res.status(404).json({ error: 'Score not found' });
   }
   res.json({ message: 'Score deleted' });
 } catch (error) {
   res.status(500).json({ error: 'Failed to delete score' });
 }
});
app.listen(port, () => {
 console.log("Server running at http://localhost:${port}");
});
