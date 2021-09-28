'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const User = db.define('Users', {
  name: {
    type: Sequelize.STRING,
    unique: true
  },
  email: {
    type: Sequelize.STRING
  },
  npwp: {
    type: Sequelize.STRING,
  },
  address: {
    type: Sequelize.STRING,
  },
  mobile_phone: {
    type: Sequelize.STRING,
  },
  username: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
  },
  is_active: {
    type: Sequelize.BOOLEAN,
  },
  phone: {
    type: Sequelize.STRING,
  },
  role_id: {
    type: Sequelize.INTEGER,
    defaultValue: 2
  }
}, {
  tableName: 'Users',
});

module.exports = User;