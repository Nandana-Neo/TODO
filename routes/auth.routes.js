const Router = require("express").Router;
const {body} = require('express-validator');
const router = Router();
const {createUserController, editUserController} = require('../contollers/user.controllers.js');
const passport = require('../auth.js');

router.post("/register",
        body('email').isEmail().withMessage('Invalid email address'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        createUserController
    )


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

router.get("/profile/edit", editUserController);

router.post("/profile/edit", 
    body('email').isEmail().withMessage('Invalid email address'),
    body('name').notEmpty().withMessage('Name cannot be empty'),
    editUserController
);

module.exports = router;