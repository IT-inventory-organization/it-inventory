'use strict';
const Sequelize = require('sequelize');
const sequelize = require('../../configs/database');
const db = require('../../configs/database');

const tempat_penimbunan = db.define('tempat_penimbunan', {
  tempat_penimbunan: {
    type: Sequelize.STRING
  },
  perkiraan_tanggal_pengeluaran: {
    type: Sequelize.DATE
  },
  is_tempat_penimbunan: {
    type: Sequelize.BOOLEAN
  }
}, {
  tableName: 'tempat_penimbunan',
  freezeTableName: true,
})

module.exports = tempat_penimbunan;