// config/sessionStore.js
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./sequelize'); // your Sequelize instance

// Create Sequelize-based session store
const sessionStore = new SequelizeStore({
  db: sequelize,
  checkExpirationInterval: 15 * 60 * 1000, // clean expired sessions every 15 min
  expiration: 24 * 60 * 60 * 1000, // session expires in 1 day
});

module.exports = sessionStore;
