'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const Report = db.define('Reports', {
  pengajuanSebagai: {
    type: Sequelize.STRING,
    allowNull: false
  },
  kantorPengajuan: {
    type: Sequelize.STRING,
    allowNull: false
  },
  jenisPemberitahuan: {
    type: Sequelize.STRING,
    allowNull: false
  },
  jenisKeluar: {
    type: Sequelize.STRING,
    allowNull: false
  },
  userId: {
    type: Sequelize.INTEGER,
    references: {
      model: "Users",
      key: "id"
    },
    onDelete: "cascade",
    onUpdate: "cascade"
  }
}, {
  tableName: 'Reports',
})

module.exports = Report;