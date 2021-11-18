'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const adjustmentBarang = db.define('adjustmentBarang', {
  namaBarang: {
    type: Sequelize.STRING
  },
  nomorAdjustment: {
    type: Sequelize.STRING
  },
  tanggalAdjustment: {
    type: Sequelize.DATEONLY
  },
  quantity: {
    type: Sequelize.DECIMAL
  },
  remarks: {
    type: Sequelize.STRING
  },
}, {
  tableName: 'adjustmentBarang',
  freezeTableName: true,
})

module.exports = adjustmentBarang;