'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const IdentitasBarang = db.define('identitas_barang', {
  negara_asal: {
    allowNull: true,
    type: Sequelize.STRING
  },
  jenis_barang: {
    type: Sequelize.STRING
  },
  nilai_barang: {
    type: Sequelize.INTEGER
  },
  cara_pembayaran: {
    type: Sequelize.STRING
  },
  asal_barang: {
    type: Sequelize.STRING
  },
  jumlah_barang: {
    type: Sequelize.INTEGER
  },
  reportId: {
    allowNull: false,
    type: Sequelize.INTEGER,
    references: {
      model: 'reports',
      key: 'id'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade'
  },
  jumlah_kemasan: {
    type: Sequelize.INTEGER
  },
}, {
  tableName: 'identitas_barang',
  freezeTableName: true,
})

module.exports = IdentitasBarang;