const Router = require("express").Router;
const fs = require('fs');

const router = Router();


router.get("/", (req, res)=>{ 
    fs.readdir('./files', (err, files) => {
        res.render("index.ejs", {files:files});
    })
})

router.get("/register", (req, res)=>{ 
    res.render("auth/register.ejs");
})

router.get("/login", (req, res)=>{ 
    res.render("auth/login.ejs");
})

module.exports = router;