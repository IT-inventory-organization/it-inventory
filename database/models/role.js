'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const Role = db.define('Roles', {
  name: {
    type: Sequelize.STRING
  }
}, {
  tableName: 'Roles',
});

module.exports = Role;