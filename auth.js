const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const bcrypt = require('bcrypt');
const {getUserByEmail, createUser} = require('./models/user.model.js');

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
            if(user.mode == 'G'){
                return done(null, false, {message: 'Email allowed only via Google'})
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

passport.use('google', new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/done',
    },
    async function verify(req, accessToken, refreshToken, profile, done) {
        console.log("In google strategy");
        try{
            const email = profile.email;
            let user;
            user = await getUserByEmail(email);
            if (!user){
                user = await createUser({email: email, password:"", mode:'G'});
            }
            return done(null, user);

        } catch(error) {
            console.log(error);
            return done(error, false);
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