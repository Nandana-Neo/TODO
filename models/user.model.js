const db = require('../config/db.js')

async function createUser({email, password}){
    try {
        const {rows} = await db.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, password]);
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