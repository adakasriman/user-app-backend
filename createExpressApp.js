// createExpressApp.js
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./db');
require('dotenv').config();

function createExpressApp() {
    const app = express();

    // Middleware
    app.use(cors({
        origin: function (origin, callback) {
            if (!origin || origin.startsWith('http://localhost')) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true
    }));
    
    app.use(express.json());

    app.use(session({
        secret: process.env.JWT_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new pgSession({
            pool: pool,
            tableName: 'session',
            errorLog: console.log
        }),
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60, // 1 hour
        }
    }));

    return app;
}

module.exports = createExpressApp;
