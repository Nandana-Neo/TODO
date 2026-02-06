const pg = require('pg');
const env = require('dotenv');
env.config();


const pool = new pg.Pool({
    user: env.POSTGRES_USER,
    host: env.POSTGRES_HOST,
    database: env.POSTGRES_DB,
    password: env.POSTGRES_PASSWORD,
    port: env.POSTGRES_PORT
})

module.exports = pool;