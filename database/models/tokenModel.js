'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const Token = db.define('Token', {
  userId: {
    type: Sequelize.STRING,
  },
  token: {
    type: Sequelize.STRING
  },
  createdAt: {
    type: Sequelize.DATE
  },
}, {
  tableName: 'Token',
  freezeTableName: true,
})

module.exports = Token;