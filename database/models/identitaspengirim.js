'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const reportIdentitasPengirim = db.define('IdentitasPengirim', {
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
  tableName: 'IdentitasPengirim',
  freezeTableName:true,
})

module.exports = reportIdentitasPengirim;