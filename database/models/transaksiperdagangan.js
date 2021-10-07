'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const reportTransaksiPerdagangan = db.define('TransaksiPerdagangan', {
  transaksi: {
    type: Sequelize.STRING
  },
  transaksiLainnya: {
    type: Sequelize.STRING
  },
  valuta: {
    type: Sequelize.STRING
  },
  kursNDPBM: {
    type: Sequelize.INTEGER
  },
  cif: {
    type: Sequelize.DECIMAL
  },
  voluntaryDeclaration: {
    type: Sequelize.STRING
  },
  freight: {
    type: Sequelize.INTEGER
  },
  hargaPenyerahan: {
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
  tableName: 'TransaksiPerdagangan',
  freezeTableName:true,
})

module.exports = reportTransaksiPerdagangan;