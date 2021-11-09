'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const DataPengangkutan = db.define('data_pengangkutan', {
  cara_angkut: {
    type: Sequelize.STRING
  },
  bendera: {
    type: Sequelize.STRING
  },
  nama_pengangkut: {
    type: Sequelize.STRING
  },
  nomor_voy_flight_pol: {
    type: Sequelize.STRING
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
  tableName: 'data_pengangkutan',
  freezeTableName: true,
})

module.exports = DataPengangkutan;