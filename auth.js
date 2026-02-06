const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const {getUserByEmail} = require('./models/user.model.js');

passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
    },
    async(email, password, done)=>{
        console.log("Verifying user:", email);
        try{
            const user = await getUserByEmail(email);
            if(!user){
                console.log("User not found:", email);
                return done(null, false, { message: 'Incorrect email or password' });
            }

            const hashedPassword = user.password;
            const isMatch = await bcrypt.compare(password, hashedPassword);
            if(!isMatch){
                console.log("Incorrect password for user:", email);
                return done(null, false, { message: 'Incorrect email or password' });
            }
            
            console.log("Authentication successful for user:", email);
            return done(null, user);
        }
        catch (err){
            console.log("Error in authentication:", err);
            return done(err);
        }
    }
))

// data to be stored in session cookie is serialized here
passport.serializeUser((user, done)=>{
    done(null, {id: user.id, name: user.name});
})

// data coming from session cookie is deserialized here
passport.deserializeUser(async (user, done)=>{
    done(null, user); 
})

module.exports = passport;