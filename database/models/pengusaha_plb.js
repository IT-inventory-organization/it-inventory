'use strict';
const Sequelize = require('sequelize');
const sequelize = require('../../configs/database');
const db = require('../../configs/database');

const PengusahaPLB = db.define('pengusaha_PLB', {
  jenisIdentitasPenjual: {
    type: Sequelize.STRING
  },
  namaPenjual: {
    type: Sequelize.STRING
  },
  nomorIdentitasPenjual: {
    type: Sequelize.STRING
  },
  alamatPenjual: {
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
  tableName: 'pengusaha_PLB',
  freezeTableName: true,
})

module.exports = PengusahaPLB;