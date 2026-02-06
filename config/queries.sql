-- SQL queries for database setup and operations
CREATE database todo_app;

-- create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) DEFAULT 'NewUser',
    created_on DATE NOT NULL DEFAULT CURRENT_DATE
);