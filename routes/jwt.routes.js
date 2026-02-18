const Router = require('express').Router;
const {body, validationResult} = require('express-validator');
const router = Router();
const {createUser, getUserByEmail} = require('../models/user.model.js');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {authenticateToken} = require('../middlewares/jwt.middleware.js');

dotenv.config();

router.post("/register",
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        try{
            const {email, password} = req.body;
            const user = await getUserByEmail(email);
            if(user){
                return res.status(409).json({ errors: [
                    { 
                        msg: 'Email already in use' ,
                        location: 'body',
                        param: 'email'
                    }
                ] });
            }
            const userRow = await createUser({email, password});
            return res.status(201).json({ message: 'User created successfully', user: 
                {
                    id: userRow.id,
                    name: userRow.name,
                    email: userRow.email
                }
             });
        }
        catch(err){
            console.log(err);
            return res.status(500).json({ errors: [{msg: 'Error in registration'}] });
        }
    }
)

router.post("/login", async (req, res) => {
        try{
            const {email, password} = req.body;
        
            if (!email || !password) {
                return res.status(400).json({ errors: [{msg:'Email and password are required'}] });
            }
            const user = await getUserByEmail(email);
            if(!user){
                return res.status(400).json({ errors: [{ msg: 'Incorrect email or password' }] });
            }
            if(user.mode == 'G'){
                return res.status(400).json({errors: [{msg: 'Email allowed only via Google'}]});
            }

            const hashedPassword = user.password;
            const isMatch = await bcrypt.compare(password, hashedPassword);
            if(!isMatch){
                return res.status(400).json({ errors: [{ msg: 'Incorrect email or password' }] });
            }

            // generate token and return
            const tokenPayload = {
                id: user.id,
                name: user.name,
                email: user.email
            };
            const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, options = {expiresIn: '1h'});
            return res.status(200).json({ message: 'Login successful', token: token });
            
        }
        catch(err){
            console.log(err);
            return res.status(500).json({ errors: [{msg: 'Error in login'}] });
        }
    }
)

router.post("/logout", (req, res) => {
    // For JWT, logout is handled on the client side by deleting the token
    return res.status(200).json({ message: 'Logout successful. Please delete the token on client side.' });
})

router.get("/profile", authenticateToken, 
    async (req, res) => {
        // req.user is set by authenticateToken middleware
        return res.status(200).json({ user: req.user });
    }
)

module.exports = router;