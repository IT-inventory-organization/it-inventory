'use strict';
const Sequelize = require('sequelize');
const sequelize = require('../../configs/database');
const db = require('../../configs/database');

const pengirim_barang = db.define('pengirim_barang', {
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
  },
  report_id: {
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
  tableName: 'pengirim_barang',
  freezeTableName: true,
})

module.exports = pengirim_barang;