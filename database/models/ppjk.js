'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const PPJK = db.define('ppjk', {
  jenisIdentitasPpjk: {
    type: Sequelize.STRING
  },
  namaPpjk: {
    type: Sequelize.STRING
  },
  nomorIdentitasPpjk: {
    type: Sequelize.STRING
  },
  alamatPpjk: {
    type: Sequelize.STRING
  },
  reportId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'reports',
      key: 'id'
    },
    onUpdate:'cascade',
    onDelete:'cascade'
  },
}, {
  tableName: 'ppjk',
  freezeTableName: true,
})

module.exports = PPJK;