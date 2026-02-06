const Router = require("express").Router;
const {body, validationResult} = require('express-validator');
const router = Router();
const {createUser, getUserByEmail} = require('../models/user.model.js');
const passport = require('../auth.js');

router.post("/register",
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    async (req, res)=>{

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            for (let error of errors.array()) {
                console.log(`Validation error: ${error.msg}`);
            }
            return res.render("auth/register.ejs", { errors: errors.array() });
        }

        const {email, password} = req.body;

        try{
            const user = await getUserByEmail(email);
            if(user){
                return res.render("auth/register.ejs", { errors: [{ msg: 'Email already in use' }] });
            }
            const userRow = await createUser({email, password});
            
            req.login(userRow, (err)=>{
                if(err){
                    console.log("Error in auto-login after registration:", err);
                    return res.render("auth/register.ejs", { errors: [{ msg: 'Registration successful, but auto-login failed. Please login manually.' }] });
                }
                return res.redirect("/");
            })
            console.log("Registration successful!");
        } catch(err){
            console.log(err);
            return res.render("auth/register.ejs", { errors: [{ msg: 'Error in registration' }] });
        }

    })


router.post("/login", passport.authenticate('local', {
    successRedirect: "/",
    failureRedirect: "/login",
    session: true,
    // failureFlash: true
}))

router.post("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            console.log("Error during logout:", err);
            return res.redirect("/");
        }
        console.log("Logout successful");
        res.redirect("/");
    });
})

module.exports = router;