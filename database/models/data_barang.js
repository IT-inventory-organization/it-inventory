'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const data_barang = db.define('data_barang', {
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
  tableName: 'data_barang',
  freezeTableName: true,
})

module.exports = data_barang;