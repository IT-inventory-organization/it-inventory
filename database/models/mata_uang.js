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
  ndbpmKurs: {
    type: Sequelize.DECIMAL
  },
  cif: {
    type: Sequelize.DECIMAL
  },
  transaksiLainnya: {
    type: Sequelize.STRING
  },
  hargaPenyerahan: {
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