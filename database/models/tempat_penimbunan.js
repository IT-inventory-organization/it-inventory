'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const TempatPenimbunan = db.define('tempat_penimbunan', {
  tempatPenimbunan: {
    type: Sequelize.STRING
  },
  perkiraanTanggalPengeluaran: {
    type: Sequelize.DATE
  },
  isTempatPenimbunan: {
    type: Sequelize.BOOLEAN
  },
  reportId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'reports',
      key: 'id'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade'
  },
}, {
  tableName: 'tempat_penimbunan',
  freezeTableName: true,
})

module.exports = TempatPenimbunan;