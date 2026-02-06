const Router = require("express").Router;
const fs = require('fs');
const router = Router();
const {getUserController, editUserController} = require('../contollers/user.controllers.js');

router.get("/", (req, res)=>{ 
    const user = req.user;
    fs.readdir('./files', (err, files) => {
        res.render("index.ejs", {files:files, user:user});
    })
})

router.get("/register", (req, res)=>{ 
    res.render("auth/register.ejs");
})

router.get("/login", (req, res)=>{ 
    res.render("auth/login.ejs");
})

router.get("/profile", getUserController);

module.exports = router;