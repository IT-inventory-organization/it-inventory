'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const barangPO = db.define('barangPO', {
  poId: {
    type: Sequelize.INTEGER
  },
  idBarang: {
    type: Sequelize.INTEGER
  },
  quantity: {
    type: Sequelize.DECIMAL
  },
  kodeBarang: {
    type: Sequelize.STRING
  },
  itemDeskripsi: {
    type: Sequelize.STRING
  },
  hargaSatuan: {
    type: Sequelize.STRING
  },
}, {
  tableName: 'barangPO',
  freezeTableName: true,
})

module.exports = barangPO;
