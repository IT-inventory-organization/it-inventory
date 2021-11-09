'use strict';
const Sequelize = require('sequelize');
const sequelize = require('../../configs/database');
const db = require('../../configs/database');

const pengusaha_PLB = db.define('pengusaha_PLB', {
  jenis_identitas_penjual: {
    type: Sequelize.STRING
  },
  nama_penjual: {
    type: Sequelize.STRING
  },
  nomor_identitas_penjual: {
    type: Sequelize.STRING
  },
  alamat_penjual: {
    type: sequelize.STRING
  }
}, {
  tableName: 'pengusaha_PLB',
  freezeTableName: true,
})

module.exports = pengusaha_PLB;