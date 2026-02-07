const Router = require("express").Router;
const fs = require('fs');
const router = Router();
const {getUserController} = require('../contollers/user.controllers.js');

router.get("/", (req, res)=>{ 
    if (req.isAuthenticated())
        return res.redirect("/task");
    return res.render("index.ejs");
})

router.get("/register", (req, res)=>{ 
    res.render("auth/register.ejs");
})

router.get("/login", (req, res)=>{ 
    res.render("auth/login.ejs");
})

router.get("/profile", getUserController);

module.exports = router;