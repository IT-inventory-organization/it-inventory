'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const DokumenPemasukan = db.define('dokumenPemasukan', {
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
  tableName: 'dokumenPemasukan',
  freezeTableName: true,
})

module.exports = DokumenPemasukan;