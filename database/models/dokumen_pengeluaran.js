'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const DokumenPengeluaran = db.define('dokumenPengeluaran', {
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
  dokumenPemasukanId: {
    allowNull: false,
    type: Sequelize.INTEGER,
    references: {
      model: 'dokumenPemasukan',
      key: 'id'
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  },
  nomorDokumen: {
    allowNull: false,
    type: Sequelize.STRING
  },
  tanggalDokumen: {
    allowNull: false,
    type: Sequelize.DATE
  },
}, {
  tableName: 'dokumenPengeluaran',
  freezeTableName: true,
})

module.exports = DokumenPengeluaran;