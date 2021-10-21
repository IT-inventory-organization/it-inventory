'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const reportDataPetiKemas = db.define('DataPetiKemas', {
  dataKontainer: {
    type: Sequelize.STRING
  },
  volumeKontainer: {
    type: Sequelize.DECIMAL
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
  tableName: 'DataPetiKemas',
  freezeTableName: true,
})

module.exports = reportDataPetiKemas;