'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const TempatPenimbunan = db.define('tempatPenimbunan', {
  tempatPenimbunan: {
    type: Sequelize.STRING
  },
  perkiraanTanggalPengeluaran: {
    type: Sequelize.DATEONLY
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
  idKapal: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'dataKapal',
      key: 'id'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade'
  }
}, {
  tableName: 'tempatPenimbunan',
  freezeTableName: true,
})

module.exports = TempatPenimbunan;