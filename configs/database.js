const config = require("../config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  config.get("DB_NAME"),
  config.get("DB_USER"),
  config.get("DB_PASS"),
  {
    host: config.get("DB_HOST"),
    port: config.get("DB_PORT"),
    dialect: "postgres",
    operatorsAliases: Sequelize.Op,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    timezone: "+07:00",
  }
);

module.exports = sequelize;
