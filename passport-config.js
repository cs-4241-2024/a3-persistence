// const LocalStrategy = require('passport-local').Strategy
// const bcrypt = require('bcrypt')


// function initialize(passport, getUserByEmail, getUserById) {
//     const authenticateUser = async (email, password, done) =>{
//         const user = getUserByEmail(email)
//         if (user == null) {
//             return done(null, false, { message: 'No user with that email' })
//         }

//         try{
//             if (await bcrypt.compare(password, user.password)) {
//                 return done(null, user)
//             } else {
//                 return done(null, false, { message: 'Password incorrect' })
//             }
//         } catch (e) {
//             return done(e)
//         }
//     }

//     passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))

//     passport.serializeUser((user, done) => done(null, user.id))
//     passport.deserializeUser((id, done) => {
//         return done(null, getUserById(id))  
//     })
// }

// module.exports = initialize

const LocalStrategy = require('passport-local').Strategy;
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
