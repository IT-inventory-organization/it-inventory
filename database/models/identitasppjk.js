'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const reportIdentitasPPJK = db.define('reportIdentitasPPJK', {
  jenisIdentitasPPJK: {
    type: Sequelize.STRING
  },
  nomorIdentitasPPJK: {
    type: Sequelize.STRING
  },
  namaPPJK: {
    type: Sequelize.STRING
  },
  alamatPPJK: {
    type: Sequelize.STRING
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
  tableName: 'IdentitasPPJK',
})

module.exports = reportIdentitasPPJK;