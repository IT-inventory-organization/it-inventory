'use strict';
const Sequelize = require('sequelize');
const sequelize = require('../../configs/database');
const db = require('../../configs/database');

const penjual_barang = db.define('penjual_barang', {
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
  tableName: 'penjual_barang',
  freezeTableName: true,
})

module.exports = penjual_barang;