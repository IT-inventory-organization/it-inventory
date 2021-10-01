'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const reportListDokumen = db.define('ListDokumen', {
  kodeDokumen: {
    type: Sequelize.STRING
  },
  nomorDokumen: {
    type: Sequelize.STRING
  },
  tanggalDokumen: {
    type: Sequelize.DATEONLY
  },
  hsCode: {
    type: Sequelize.STRING
  },
  isDelete: {
    type: Sequelize.BOOLEAN
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
  tableName: 'ListDokumen',
  freezeTableName:true,
})

module.exports = reportListDokumen;