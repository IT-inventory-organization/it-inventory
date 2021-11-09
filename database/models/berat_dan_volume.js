'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const berat_dan_volume = db.define('berat_dan_volume', {
  berat_muatan: {
    type: Sequelize.DECIMAL
  },
  berat_kapal_dengan_muatan: {
    type: Sequelize.DECIMAL
  },
  volume: {
    type: Sequelize.DECIMAL
  },
  report_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'reports',
      key: 'id'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade'
  },
}, {
  tableName: 'berat_dan_volume',
  freezeTableName: true,
})

module.exports = berat_dan_volume;