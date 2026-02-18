const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

async function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({ errors: [{msg: 'Token missing'}] });
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.id,
            name: decoded.name
        }
        next();
    }
    catch(err){
        console.log(err);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ errors: [{msg: 'Token expired'}] });
        }   
        else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ errors: [{msg: 'Invalid token'}] });
        }
        return res.status(403).json({ errors: [{msg: 'Invalid token'}] });
    }
}

module.exports = {
    authenticateToken
};