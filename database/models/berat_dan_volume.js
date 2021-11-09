'use strict';
const Sequelize = require('sequelize');
const sequelize = require('../../configs/database');
const db = require('../../configs/database');

const berat_dan_volume = db.define('berat_dan_volume', {
  berat_muatan: {
    type: Sequelize.DECIMAL
  },
  berat_kapal_dengan_muatan: {
    type: Sequelize.DECIMAL
  },
  volume: {
    type: Sequelize.DECIMAL
  }  
}, {
  tableName: 'berat_dan_volume',
  freezeTableName: true,
})

module.exports = berat_dan_volume;