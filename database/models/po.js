'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const po = db.define('po', {
  // kapalPemilik: {
  //   allowNull: false,
  //   type: Sequelize.STRING
  // },
  // kapalPembeli: {
  //   allowNull: false,
  //   type: Sequelize.STRING
  // },
  nomorPO: {
    allowNull: false,
    type: Sequelize.STRING
  },
  kapalPenjual: {
    allownull: false,
    type: Sequelize.STRING
  },
  tanggalPurchaseOrder: {
    allowNull: false,
    type: Sequelize.DATEONLY
  },
  jumlahTotal: {
    allowNull: false,
    type: Sequelize.INTEGER
  },
  remarks: {
    allowNull: true,
    type: Sequelize.STRING
  }
}, {
  tableName: 'po',
  freezeTableName: true,
  operatorsAliases: false
})

module.exports = po;
