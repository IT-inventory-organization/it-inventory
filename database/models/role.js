'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const Roles = db.define('roles', {
  name: {
    type: Sequelize.STRING
  },
}, {
  tableName: 'roles',
  freezeTableName: true,
})

module.exports = Roles;