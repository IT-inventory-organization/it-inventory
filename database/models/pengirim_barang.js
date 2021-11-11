'use strict';
const Sequelize = require('sequelize');
const sequelize = require('../../configs/database');
const db = require('../../configs/database');

const pengirim_barang = db.define('pengirim_barang', {
  jenisIdentitasPenjual: {
    type: Sequelize.STRING
  },
  namaPenjual: {
    type: Sequelize.STRING
  },
  nomorIdentitasPenjual: {
    type: Sequelize.STRING
  },
  alamatPenjual: {
    type: sequelize.STRING
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
  tableName: 'pengirim_barang',
  freezeTableName: true,
})

module.exports = pengirim_barang;