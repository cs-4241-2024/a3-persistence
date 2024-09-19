import strategy from 'passport-github2'
import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config();

passport.use(new strategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://a3-carter-moore.vercel.app/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {

     return done(null, profile);
    }
))

passport.serializeUser(function(user, done) {
    done(null, user);
    });

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

export default passport;