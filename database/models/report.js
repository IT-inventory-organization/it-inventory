'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const Report = db.define('Report', {
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
  },
  status: {
    type: Sequelize.STRING
  },
  typeReport: {
    type: Sequelize.STRING,
  },
  BCDocumentType: {
    type: Sequelize.STRING,
  },
  isDelete: {
    type: Sequelize.BOOLEAN,
  }
}, {
  tableName: 'Reports',
  freezeTableName: true
})

module.exports = Report;