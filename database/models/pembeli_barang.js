'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const PembeliBarang = db.define('pembeli_barang', {
  jenis_identitas_pembeli: {
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
  tableName: 'pembeli_barang',
  freezeTableName: true,
})

module.exports = PembeliBarang;