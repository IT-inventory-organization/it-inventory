'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const reportDataLartas = db.define('DataLartas', {
  name: {
    type: Sequelize.STRING
  },
  reportId: {
    allowNull: false,
    type: Sequelize.INTEGER,
    references: {
      model: "Reports",
      key: "id"
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  },
}, {
  tableName: 'DataLartas',
  freezeTableName:true,
})

module.exports = reportDataLartas;