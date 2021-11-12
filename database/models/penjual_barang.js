'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const PenjualBarang = db.define('penjual-barang', {
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
  tableName: 'penjual-barang',
  freezeTableName: true,
})

module.exports = PenjualBarang;