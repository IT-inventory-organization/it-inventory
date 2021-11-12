'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const PengusahaPLB = db.define('pengusaha_PLB', {
  jenisIdentitasPengusahaPLB: {
    type: Sequelize.STRING
  },
  namaPengusahaPLB: {
    type: Sequelize.STRING
  },
  nomorIdentitasPengusahaPLB: {
    type: Sequelize.STRING
  },
  alamatPengusahaPLB: {
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