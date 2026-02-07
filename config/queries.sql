-- SQL queries for database setup and operations
CREATE database todo_app;

-- create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) DEFAULT 'NewUser',
    created_on DATE NOT NULL DEFAULT CURRENT_DATE,
    mode VARCHAR(2) NOT NULL DEFAULT 'L'
);

-- L for local, G for google oauth

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    task VARCHAR(255) NOT NULL,
    done BIT NOT NULL DEFAULT '0',
    user_id INTEGER REFERENCES users(id),
    date DATE NOT NULL DEFAULT CURRENT_DATE
);