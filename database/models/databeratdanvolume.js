'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const reportDataBeratDanVolume = db.define('DataBeratDanVolume', {
  kantorPabeanAsal: Sequelize.STRING,
  kategoryPemberitahuan: Sequelize.STRING,
  kategoryPengeluaran: Sequelize.STRING,
  tujuanPengeluan: Sequelize.STRING,
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
  tableName: 'DataBeratDanVolume',
  freezeTableName:true,
})

module.exports = reportDataBeratDanVolume;