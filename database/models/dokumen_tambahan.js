'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const DokumenTambahan = db.define('dokumenTambahan', {
  nomorBC10: {
    allowNull: true,
    type: Sequelize.STRING
  },
  nomorBC11: {
    allowNull:true,
    type: Sequelize.STRING
  },
  nomorBL: {
    allowNull: true,
    type: Sequelize.STRING
  },
  tanggalBC10: {
    allowNull: true,
    type: Sequelize.DATEONLY
  },
  tanggalBC11: {
    allowNull: true,
    type: Sequelize.DATEONLY
  },
  tanggalBL: {
    allowNull: true,
    type: Sequelize.DATEONLY
  },
  reportId: {
    allowNull: false,
    type: Sequelize.INTEGER,
    references: {
      model: 'reports',
      key: 'id'
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  },
}, {
  tableName: 'dokumenTambahan',
  freezeTableName: true,
})

module.exports = DokumenTambahan;