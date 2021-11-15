'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const Report = db.define('report', {
  jenisPemberitahuan: {
    type: Sequelize.STRING
  },
  diAjukanDiKantor: {
    type: Sequelize.STRING
  },
  jenisDokumenBC: {
    type: Sequelize.STRING
  },
  userId: {
    type: Sequelize.INTEGER,
    references: {
      model: 'info_pengguna',
      key: 'id'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade'
  }
}, {
  tableName: 'report',
  freezeTableName: true,
})

module.exports = Report;