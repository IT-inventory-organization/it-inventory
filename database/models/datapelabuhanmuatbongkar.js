'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const reportDataPelabuhanMuatBongkar = db.define('DataPelabuhanMuatBongkar', {
  beratBersih: {
    type: Sequelize.DECIMAL
  },
  beratKotor: {
    type: Sequelize.DECIMAL
  },
  volume: {
    type: Sequelize.DECIMAL
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
  tableName: 'DataPelabuhanMuatBongkar',
  freezeTableName:true,
})

module.exports = reportDataPelabuhanMuatBongkar;