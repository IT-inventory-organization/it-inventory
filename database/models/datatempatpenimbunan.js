'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const reportDataTempatPenimbunan = db.define('DataTempatPenimbunan', {
  tempatPenimbunan: {
    type: Sequelize.STRING
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
  tableName: 'DataTempatPenimbunan',
  freezeTableName:true,
})

module.exports = reportDataTempatPenimbunan;