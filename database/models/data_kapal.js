'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const DataKapal = db.define('dataKapal', {
  voyageKapal: {
    type: Sequelize.STRING
  },
  benderaKapal: {
    type: Sequelize.STRING
  },
  namaKapal: {
    type: Sequelize.STRING
  },
  tanggalKedatangan: {
    type: Sequelize.DATE
  },
  tanggalKeberangkatan: {
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
  tableName: 'dataKapal',
  freezeTableName: true,
})

module.exports = DataKapal;