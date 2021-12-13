'use strict';
const Sequelize = require('sequelize');
const sequelize = require('../../configs/database');
const db = require('../../configs/database');

const InvoicePO = db.define('invoicePO', {
  poId: {
    type: Sequelize.INTEGER
  },
  nomorPO: {
    type: Sequelize.STRING
  },
}, {
  tableName: 'invoicePO',
  freezeTableName: true,
})

module.exports = InvoicePO;


