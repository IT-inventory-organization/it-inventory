'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const reportDataPerkiraanTanggalPengeluaran = db.define('DataPerkiraanTanggalPengeluaran', {
  perkiraanTanggalPengeluaran: {
    type: Sequelize.DATEONLY
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
  tableName: 'DataPerkiraanTanggalPengeluaran',
  freezeTableName:true,
})

module.exports = reportDataPerkiraanTanggalPengeluaran;