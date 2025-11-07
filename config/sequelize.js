// config/sequelize.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Initialize Sequelize with PostgreSQL connection string
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  ssl: {
    rejectUnauthorized: false,  // Necessary if you're using SSL with PostgreSQL (e.g., with cloud databases like Heroku)
  },
  logging: false
});

// sequelize.authenticate()
//   .then(() => console.log('✅ Database connected successfully'))
//   .catch(err => console.error('❌ Database connection failed:', err));

module.exports = sequelize;