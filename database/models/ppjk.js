'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const PPJK = db.define('ppjk', {
  jenis_identitas_ppjk: {
    type: Sequelize.STRING
  },
  nama_ppjk: {
    type: Sequelize.STRING
  },
  nomor_identitas_ppjk: {
    type: Sequelize.STRING
  },
  alamat_ppjk: {
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