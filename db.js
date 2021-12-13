// const mongoose = require("mongoose");
// const sequelize = require('sequelize');

const Sequelize = require('sequelize');

// Option 1: Passing parameters separately
const sequelize = new Sequelize('database-it-inventory', 'user-it-inventory', 'user_sfsdf!@sfk123', {
  host: '104.248.156.113',
  dialect: 'postgres'
  /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
});

// let DB_URL = process.env.DB_URL;
// here we are using the MongoDB Url we defined in our ENV file

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });


