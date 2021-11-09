'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const TempatPenimbunan = db.define('tempat_penimbunan', {
  tempat_penimbunan: {
    type: Sequelize.STRING
  },
  perkiraan_tanggal_pengeluaran: {
    type: Sequelize.DATE
  },
  is_tempat_penimbunan: {
    type: Sequelize.BOOLEAN
  },
  report_id: {
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