'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const MataUang = db.define('mata_uang', {
  valuta: {
    type: Sequelize.STRING
  },
  freight: {
    type: Sequelize.INTEGER
  },
  ndbpm_kurs: {
    type: Sequelize.DECIMAL
  },
  cif: {
    type: Sequelize.DECIMAL
  },
  transaksi_lainnya: {
    type: Sequelize.STRING
  },
  harga_penyerahan: {
    type: Sequelize.DECIMAL
  },
  reportId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'reports',
      key:'id'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade'
  },
}, {
  tableName: 'mata_uang',
  freezeTableName: true,
})

module.exports = MataUang;