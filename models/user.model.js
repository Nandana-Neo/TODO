const db = require('../config/db.js')
const bcrypt = require('bcrypt');
const env = require('dotenv');
env.config();

async function createUser({email, password}){
    try {
        const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
        const {rows} = await db.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, hashedPassword]);
        return rows[0];
    }
    catch(err){
        console.log(err);
        throw err;
    }
}

async function getUserByEmail(email){
    try {
        const {rows} = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        return rows[0];
    }
    catch(err){
        console.log(err);
        throw err;
    }
}

async function getUserById(id){
    try {
        const {rows} = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        return rows[0];
    }
    catch(err){
        console.log(err);
        throw err;
    }
}

async function getUsers(){
    try {
        const {rows} = await db.query('SELECT * FROM users');
        return rows;
    }
    catch(err){
        console.log(err);
        throw err;
    }
}

module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    getUsers
}