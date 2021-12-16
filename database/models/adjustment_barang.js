'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const adjustmentBarang = db.define('adjustmentBarang', {
  namaBarang: {
    type: Sequelize.STRING
  },
  nomorAdjustment: {
    type: Sequelize.STRING
  },
  tanggalAdjustment: {
    type: Sequelize.DATEONLY
  },
  quantity: {
    type: Sequelize.DECIMAL
  },
  remarks: {
    type: Sequelize.STRING
  },
  dataBarangId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'dataBarang',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  }

}, {
  tableName: 'adjustmentBarang',
  freezeTableName: true,
});

module.exports = adjustmentBarang;