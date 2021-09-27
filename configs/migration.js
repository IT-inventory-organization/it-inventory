const config = require('../config');

const db = {
  username: config.get('DB_USER'),
  password: config.get('DB_PASS'),
  database: config.get('DB_NAME'),
  host: config.get('DB_HOST'),
  dialect: config.get('DIALECT'),
  logging: console.log,
  pool: {
    max: 30,
    min: 0,
    idle: 10000
  },
  timezone: '+07:00',
};

module.exports = db;
