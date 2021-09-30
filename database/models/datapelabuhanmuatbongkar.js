'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');
/**
 * Mengganti Model
 */
// const reportDataPelabuhanMuatBongkar = db.define('DataPelabuhanMuatBongkar', {
//   beratBersih: {
//     type: Sequelize.DECIMAL
//   },
//   beratKotor: {
//     type: Sequelize.DECIMAL
//   },
//   volume: {
//     type: Sequelize.DECIMAL
//   },
//   reportId: {
//     allowNull: false,
//     type: Sequelize.INTEGER,
//     references: {
//       model: "Reports",
//       key: "id"
//     },
//     onDelete: 'cascade',
//     onUpdate: 'cascade'
//   },
// }, {
//   tableName: 'DataPelabuhanMuatBongkar',
//   freezeTableName:true,
// })

const reportDataPelabuhanMuatBongkar = db.define('DataPelabuhanMuatBongkar', {
  pelabuhanMuat: {
    type: Sequelize.STRING
  },
  pelabuhanTujuan: {
    type: Sequelize.STRING
  },
  pelabuhanTransit: {
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
  tableName: 'DataPelabuhanMuatBongkar',
  freezeTableName:true,
})

module.exports = reportDataPelabuhanMuatBongkar;