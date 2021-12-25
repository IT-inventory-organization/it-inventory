'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const dataBarang = db.define('dataBarang', {
  kodeBarang: {
    type: Sequelize.STRING
  },
  namaBarang: {
    type: Sequelize.STRING
  },
  uraian: {
    type: Sequelize.STRING
  },
  nettoBruttoVolume: {
    type: Sequelize.DECIMAL
  },
  satuanKemasan: {
    type: Sequelize.STRING
  },
  stock: {
    type: Sequelize.DECIMAL
  },
  posTarif: {
    type: Sequelize.STRING
  },
  bm: {
    type: Sequelize.DECIMAL
  },
  ppn: {
    type: Sequelize.DECIMAL
  },
  ppnbm: {
    type: Sequelize.DECIMAL
  },
  cukai: {
    type: Sequelize.DECIMAL
  },
  nilaiPabeanHargaPenyerahan: {
    type: Sequelize.DECIMAL,
    allowNull: true
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
  tableName: 'dataBarang',
  freezeTableName: true
})

module.exports = dataBarang;