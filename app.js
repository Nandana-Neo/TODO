const express = require("express");
const app = express();
const path = require('path')
const fs = require('fs')
const routes = require("./routes/index.js");

app.locals.themeColor = "";
app.use(routes);


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")))
app.set('view engine', 'ejs');



app.listen(8080, (req, res)=> {
    console.log("App listening on port 8080");
})