const express = require('express');
const cors = require('cors');
const session = require('express-session');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const sequelize = require('./config/sequelize');
const rateLimit = require('express-rate-limit');
const sessionStore = require('./config/sessionStore');

dotenv.config();

function createExpressApp() {
    const app = express();

    // ✅ Allow your React frontend
    app.use(
        cors({
            origin: ['http://localhost:5173'], 
            credentials: true, // allow cookies & session headers
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        })
    );

    // ✅ Basic security, logs, and JSON
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(express.json());

    // ✅ Rate limiter
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 min
        max: 100,
        message: 'Too many requests from this IP, try again later.',
    });
    app.use(limiter);

    // ✅ Express session setup
    app.use(
        session({
            secret: process.env.SESSION_SECRET || 'mysecretkey',
            resave: false,
            saveUninitialized: false,
            store: sessionStore,
            cookie: {
                httpOnly: true,
                secure: false, // true only if using HTTPS
                sameSite: 'lax', // RTK Query safe default
                maxAge: 1000 * 60 * 60, // 1 hour
            },
        })
    );

    // ✅ Connect and sync database
    sequelize
        .sync()
        .then(() => console.log('✅ Database synced successfully'))
        .catch((err) => console.error('❌ DB sync error:', err));

    return app;
}

module.exports = createExpressApp;
