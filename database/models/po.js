'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const po = db.define('po', {
  kapalPenjual: {
    allowNull: false,
    type: Sequelize.STRING
  },
  nomorPO: {
    allowNull: false,
    type: Sequelize.STRING
  },
  tanggalPurchaseOrder: {
    allowNull: false,
    type: Sequelize.DATEONLY
  },
  jumlahTotal: {
    allowNull: false,
    type: Sequelize.INTEGER
  },
  remarks: {
    allowNull: true,
    type: Sequelize.STRING
  },
  reportId: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'report',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'NO ACTION',
  },
  isDelete: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    defaultValue: false
  }
}, {
  tableName: 'po',
  freezeTableName: true,
  operatorsAliases: false
})

module.exports = po;
