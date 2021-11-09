'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const DataKapal = db.define('data_kapal', {
  voyage_kapal: {
    type: Sequelize.STRING
  },
  bendera_kapal: {
    type: Sequelize.STRING
  },
  nama_kapal: {
    type: Sequelize.STRING
  },
  tanggal_kedatangan: {
    type: Sequelize.DATE
  },
  tanggal_keberangkatan: {
    type: Sequelize.DATE
  },
  reportId:{
    allowNull: false,
    type: Sequelize.INTEGER,
    references: {
      model: 'reports',
      key: 'id'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade'
  },
}, {
  tableName: 'data_kapal',
  freezeTableName: true,
})

module.exports = DataKapal;