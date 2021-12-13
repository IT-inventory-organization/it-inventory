'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const DataPengangkutan = db.define('dataPengangkutan', {
  caraAngkut: {
    type: Sequelize.STRING
  },
  bendera: {
    type: Sequelize.STRING
  },
  namaPengangkut: {
    type: Sequelize.STRING
  },
  nomorVoyFlightPol: {
    type: Sequelize.STRING
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
  tableName: 'dataPengangkutan',
  freezeTableName: true,
})

module.exports = DataPengangkutan;