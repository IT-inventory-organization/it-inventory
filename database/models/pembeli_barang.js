'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const PembeliBarang = db.define('pembeliBarang', {
  jenisIdentitasPembeli: {
    type: Sequelize.STRING
  },
  namaPembeli: {
    type: Sequelize.STRING
  },
  nomorIdentitasPembeli: {
    type: Sequelize.STRING
  },
  alamatPembeli: {
    type: Sequelize.STRING
  },
  reportId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    refereces: {
      model: 'reports',
      key: 'id'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade'
  },
}, {
  tableName: 'pembeliBarang',
  freezeTableName: true,
})

module.exports = PembeliBarang;