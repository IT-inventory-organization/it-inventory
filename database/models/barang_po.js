'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const barangPO = db.define('barangPO', {
  poId: {
    type: Sequelize.INTEGER,
    references: {
      model: 'po',
      key: 'id'
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  },
  idBarang: {
    type: Sequelize.INTEGER,
    references: {
      model: 'dataBarang',
      key: 'id'
    },
    onUpdate: 'cascade',
    onDelete: 'no action'
  },
  quantity: {
    type: Sequelize.DECIMAL
  },
  kodeBarang: {
    type: Sequelize.STRING
  },
  itemDeskripsi: {
    type: Sequelize.STRING
  },
  hargaSatuan: {
    type: Sequelize.STRING
  },
  satuanKemasan: {
    type: Sequelize.STRING
  },
  jumlah: {
    type: Sequelize.STRING
  }
}, {
  tableName: 'barangPO',
  freezeTableName: true,
})

module.exports = barangPO;
