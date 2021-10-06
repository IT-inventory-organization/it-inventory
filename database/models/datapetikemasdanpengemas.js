'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const reportDataPetiKemasDanPengemas = db.define('DataPetiKemasDanPengemas', {
  jumlahJenisKemasan: {
    type: Sequelize.INTEGER
  },
  jumlahPetiKemas: {
    type: Sequelize.INTEGER
  },
  jumlahJenisBarang: {
    type: Sequelize.INTEGER
  },
  reportId: {
    allowNull: false,
    type: Sequelize.INTEGER,
    references: {
      model: "Reports",
      key: "id"
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  },
}, {
  tableName: 'DataPetiKemasDanPengemas',
  freezeTableName:true,
})

module.exports = reportDataPetiKemasDanPengemas;