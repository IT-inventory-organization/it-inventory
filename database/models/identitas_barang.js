'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const IdentitasBarang = db.define('identitasBarang', {
  negaraAsal: {
    allowNull: true,
    type: Sequelize.STRING
  },
  jenisBarang: {
    type: Sequelize.STRING
  },
  nilaiBarang: {
    type: Sequelize.DECIMAL
  },
  caraPembayaran: {
    type: Sequelize.STRING
  },
  asalBarang: {
    type: Sequelize.STRING
  },
  jumlahBarang: {
    type: Sequelize.INTEGER
  },
  reportId: {
    allowNull: false,
    type: Sequelize.INTEGER,
    references: {
      model: 'reports',
      key: 'id'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade'
  },
  jumlahKemasan: {
    type: Sequelize.INTEGER
  },
}, {
  tableName: 'identitasBarang',
  freezeTableName: true,
})

module.exports = IdentitasBarang;