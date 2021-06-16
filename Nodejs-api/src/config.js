// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

const envVars = process.env;
const config = {
  jwtSecret: envVars.JWT_SECRET,
  mysql: {
    db: envVars.MYSQL_DB,
    port: envVars.MYSQL_PORT,
    host: envVars.MYSQL_HOST,
    user: envVars.MYSQL_USER,
    password: envVars.MYSQL_PASSWORD,
  },
  dmApi: envVars.DM_API,
};

module.exports = config;
