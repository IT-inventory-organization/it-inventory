'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const DataPemasukan = db.define('dokumen_pemasukan', {
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
  nomorDokumenPemasukan: {
    allowNull: false,
    type: Sequelize.STRING
  },
  tanggalDokumenPemasukan: {
    allowNull: false,
    type: Sequelize.DATE
  },
}, {
  tableName: 'dokumen_pemasukan',
  freezeTableName: true,
})

module.exports = DataPemasukan;