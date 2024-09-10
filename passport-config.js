// This file contains the configuration for Passport.js, which is used for user authentication.
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const bcrypt = require('bcrypt');
const collection = require('./config'); // Import your User model

function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        try {
            // Find user by email using Mongoose
            const user = await collection.findOne({ email: email });
            if (!user) {
                return done(null, false, { message: 'No user with that email' });
            }

            // Check password
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incorrect' });
            }
        } catch (error) {
            return done(error);
        }
    };

    // Set up the local strategy for authentication
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await collection.findOne({ githubId: profile.id });
                if (user) {
                    return done(null, user);
                } else {
                    const newUser = await collection.create({ githubId: profile.id, name: profile.displayName || 'GitHub User' });
                    return done(null, newUser);
                }
            } catch (error) {
                return done(error);
            }
    }))

    // Serialize user to store user ID in session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Deserialize user from session using user ID
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await collection.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
}

module.exports = initialize;
