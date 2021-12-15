'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const produksiBarangDetail = db.define('produksiBarangDetail', {
  produksiBarangId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'produksiBarang',
      key: 'id'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade'
  },
  dataBarangId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'dataBarang',
      key: 'id'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade'
  },
  kodeBarang: {
    type: Sequelize.STRING
  },
  deskripsi: {
    allowNull: true,
    type: Sequelize.STRING
  },
  quantity: {
    type: Sequelize.DECIMAL
  },
  jumlah: {
    type: Sequelize.DECIMAL
  }
}, {
  tableName: 'produksiBarangDetail',
  freezeTableName: true,
});

module.exports = produksiBarangDetail;