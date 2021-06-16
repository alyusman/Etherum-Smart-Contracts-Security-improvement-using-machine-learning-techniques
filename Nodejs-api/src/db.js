const Sequelize = require('sequelize');
const config = require('./config');
// connect to mysql
const sequelizeOptions = {
  dialect: 'mysql',
  port: config.mysql.port || 3306,
  host: config.mysql.host,
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
};

const sequelize = new Sequelize(
  config.mysql.db,
  config.mysql.user,
  config.mysql.password,
  sequelizeOptions,
);

sequelize
  .authenticate()
  .then(() => {
    console.info('Successfully established connection to database');
  })
  .catch((err) => {
    console.error('Unable to connect to database', err);
  });

module.exports = sequelize;
