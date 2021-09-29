'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const reportListBarang = db.define('listBarang', {
  jenisIdentitasPengirim: {
    type: Sequelize.STRING
  },
  nomorIdentitasPengirim: {
    type: Sequelize.STRING
  },
  namaPengirim: {
    type: Sequelize.STRING
  },
  alamatPengirim: {
    type: Sequelize.STRING
  },
  nomorIjinBpkPengirim: {
    type: Sequelize.STRING
  },
  tanggalIjinBpkPengirim: {
    type: Sequelize.DATEONLY
  },
  reportId: {
    type: Sequelize.INTEGER,
    references: {
      model: "Reports",
      key: "id"
    },
    onDelete: "cascade",
    onUpdate: "cascade"
  }
}, {
  tableName: 'listBarang',
  freezeTableName:true,
})

module.exports = reportListBarang;