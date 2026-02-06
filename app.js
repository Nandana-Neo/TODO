const express = require("express");
const bodyParser = require('body-parser');
const path = require('path')
const routes = require("./routes/index.js");
const session = require('express-session');
const env = require('dotenv');
const passport = require('./auth.js');

env.config();

const app = express();

app.locals.themeColor = "";

app.use(express.static(path.join(__dirname, "public")))
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24} // 1 day
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.listen(8080, (req, res)=> {
    console.log("App listening on port 8080");
})