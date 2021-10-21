'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const reportDataPengajuan = db.define('DataPengajuan', {
  kantorPabeanAsal: Sequelize.STRING,
  kategoryPemberitahuan: Sequelize.STRING,
  kategoryPengeluaran: Sequelize.STRING,
  tujuanPengeluaran: Sequelize.STRING,
  asalBarang: Sequelize.STRING,
  caraPembayaran: Sequelize.STRING,
  reportId: {
    type: Sequelize.INTEGER,
    references: {
      model: "Reports",
      key: "id"
    },
    onDelete: "cascade",
    onUpdate: "cascade"
  }
}, {
  tableName: 'DataPengajuan',
  freezeTableName:true,
})

module.exports = reportDataPengajuan;