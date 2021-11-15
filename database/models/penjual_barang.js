'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const PenjualBarang = db.define('penjualBarang', {
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
  tableName: 'penjualBarang',
  freezeTableName: true,
})

module.exports = PenjualBarang;