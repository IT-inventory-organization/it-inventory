'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const PengirimBarang = db.define('pengirimBarang', {
  jenisIdentitasPengirim: {
    type: Sequelize.STRING
  },
  namaPengirim: {
    type: Sequelize.STRING
  },
  nomorIdentitasPengirim: {
    type: Sequelize.STRING
  },
  alamatPengirim: {
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
  tableName: 'pengirimBarang',
  freezeTableName: true,
})

module.exports = PengirimBarang;