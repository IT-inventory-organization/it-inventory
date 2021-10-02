'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const UserActivity = db.define('UserActivity', {
  userID: {
    type: Sequelize.INTEGER,
    references: {
      model: "Users",
      key: "id"
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  },
  reportId: {
    type: Sequelize.INTEGER,
    references: {
      model: "Reports",
      key: "id"
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  },
  activity: {
    type: Sequelize.STRING,
  },
}, {
  tableName: 'UserActivities',
});

module.exports = UserActivity;