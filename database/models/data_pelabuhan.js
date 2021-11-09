'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const DataPelabuhan = db.define('data_pelabuhan', {
  pelabuhan: {
    type: Sequelize.STRING
  },
  status: {
    type: Sequelize.STRING
  },
  // Foreign Key
  reportId: {
    allowNull: false,
    type: Sequelize.INTEGER,
    references: {
      model: 'reports',
      key: 'id'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade'
  },
}, {
  tableName: 'data_pelabuhan',
  freezeTableName: true,
})

module.exports = DataPelabuhan;