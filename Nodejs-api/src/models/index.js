const Sequelize = require('sequelize');
const sequelize = require('../db');

const users = require('./users')(sequelize, Sequelize);
const files = require('./files')(sequelize, Sequelize);
const report = require('./report')(sequelize, Sequelize);

// Doing manually to get ide intellisense
const db = {
  sequelize,
  users,
  files,
  report,
};

db.sequelize = sequelize;

module.exports = db;
