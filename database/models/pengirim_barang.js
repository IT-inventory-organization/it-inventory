'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const pengirim_barang = db.define('pengirim_barang', {
  jenisIdentitasPengirim: {
    type: Sequelize.STRING
  },
  namaPengirim: {
    type: Sequelize.STRING
  },
  nomorIdentitasPengirim: {
    type: Sequelize.STRING
  },
  alamatPengirim: {
    type: Sequelize.STRING
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