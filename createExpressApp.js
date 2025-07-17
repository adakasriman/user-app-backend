// createExpressApp.js
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./config/db');
const morgan = require('morgan');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');
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

    app.use(morgan('dev'));
    app.use(helmet()); // default security headers
    // app.use(xssClean()); // prevent xss attacks
    app.use(express.json());

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,                 
        message: 'Too many requests from this IP, try again later.'
    });
    app.use(limiter);

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
            maxAge: 1000 * 60 * 60,
        }
    }));

    return app;
}

module.exports = createExpressApp;
