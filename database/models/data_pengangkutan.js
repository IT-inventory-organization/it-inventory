'use strict';
const Sequelize = require('sequelize');
const sequelize = require('../../configs/database');
const db = require('../../configs/database');

const data_pengangkutan = db.define('data_pengangkutan', {
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
    type: sequelize.STRING
  }
}, {
  tableName: 'data_pengangkutan',
  freezeTableName: true,
})

module.exports = data_pengangkutan;