'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const berat_dan_volume = db.define('berat_dan_volume', {
  beratMuatan: {
    type: Sequelize.DECIMAL
  },
  beratKapalDenganMuatan: {
    type: Sequelize.DECIMAL
  },
  volume: {
    type: Sequelize.DECIMAL
  },
  reportId: {
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