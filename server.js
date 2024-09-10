if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const path = require('path');
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOveride = require('method-override')
const { User, Task } = require('./config');


const initializePassport = require('./passport-config')
initializePassport(passport)

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOveride('_method'))
app.use(express.static(path.join(__dirname, 'public')))


app.get("/", checkAuthenticated, async (req, res) => {
    const tasks = await Task.find({ userId: req.user._id });
    res.render('index.ejs', { name: req.user.name, email: req.user.email, githubId: req.user.githubId, details: tasks })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

app.post('/tasks', checkAuthenticated, async (req, res) => {
    try {
        const { daysAvailable, daysLeft } = calculateDays(req.body.startdate, req.body.duedate);

        const newTask = {
            task: req.body.task,
            startdate: req.body.startdate,
            duedate: req.body.duedate,
            daysAvailable,
            daysLeft,
            userId: req.user._id 
        };

        await Task.create(newTask);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating task');
    }
})

app.post('/login',  checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const data = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        };
        console.log("got here 1");
        const existingUser = await User.findOne({ email: data.email });
        console.log("got here 2");
        if (existingUser) {
            res.send('User already exists. Please choose a different email.');
        } else {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(data.password, saltRounds);

            data.password = hashedPassword;
            console.log("got here 3");
            await User.create(data);
        }
        res.redirect('/login');
    } catch {
        res.redirect('/register');
    }
});

app.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/github/callback', 
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        
        res.redirect('/');
    });

app.delete('/logout', (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err)
        }
        res.redirect('/login')
    })
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

function calculateDays(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const today = new Date();
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const daysAvailable = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
    let daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) {
        daysLeft = 0;
    }
    return { daysAvailable, daysLeft };
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });