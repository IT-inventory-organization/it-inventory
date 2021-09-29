'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const reportDataPengangkutan = db.define('DataPengangkutan', {
  caraAngkut: {
    type: Sequelize.STRING
  },
  namaPengangkut: {
    type: Sequelize.STRING
  },
  bendera: {
    type: Sequelize.STRING
  },
  nomorVoyFlightPol: {
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
  tableName: 'DataPengangkutan',
  freezeTableName:true,
})

module.exports = reportDataPengangkutan;