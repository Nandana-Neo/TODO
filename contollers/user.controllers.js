
const {createUser, getUserByEmail} = require('../models/user.model.js');
const {validationResult} = require('express-validator');
const {getUserById, updateUser} = require('../models/user.model.js');

async function createUserController(req, res) {
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

}

async function getUserController(req, res) {
    if (!req.isAuthenticated()) {
        return res.redirect("/login");
    }
    const userId = req.user.id;
    try {
        const user = await getUserById(userId);
        if (!user) {
            console.log("User not found with ID:", userId);
            return res.redirect("/");
        }
        res.render("auth/profile.ejs", { user: user });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error fetching user' });
    }
}

async function editUserController(req, res) {
    if (!req.isAuthenticated()) {
        return res.redirect("/login");
    }
    const userId = req.user.id;
    const user = await getUserById(userId);
    try {
        if (req.method === "GET") {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                for (let error of errors.array()) {
                    console.log(`Validation error: ${error.msg}`);
                }
                return res.render("auth/edit_profile.ejs", { errors: errors.array(), user: user });
            }
            return res.render("auth/edit_profile.ejs", { user: user });

        }

        const result = await updateUser(userId, {email: req.body.email, name: req.body.name});
        res.redirect("/profile");
    } catch (err) {
        if (err.code === '23505') { // Unique violation error code in PostgreSQL
            return res.render("auth/edit_profile.ejs", { errors: [{ msg: 'Email already registered' }], user: user });
        }
        return res.render("auth/edit_profile.ejs", { errors: [{ msg: 'Error updating profile. Please Try Again' }], user: user });
    }
}


module.exports = {
    createUserController,
    getUserController,
    editUserController
}