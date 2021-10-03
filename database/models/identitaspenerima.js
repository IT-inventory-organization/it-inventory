'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const reportIdentitasPenerima = db.define('reportIdentitasPenerima', {
  jenisIdentitasPenerima: {
    type: Sequelize.STRING
  },
  nomorIdentitasPenerima: {
    type: Sequelize.STRING
  },
  namaPenerima: {
    type: Sequelize.STRING
  },
  alamatPenerima: {
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
  tableName: 'IdentitasPenerima',
})

module.exports = reportIdentitasPenerima;