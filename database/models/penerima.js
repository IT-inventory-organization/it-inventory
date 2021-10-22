'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const reportPenerima = db.define('Penerima', {
  caraAngkutPenerima: {
    type: Sequelize.STRING
  },
  namaPengangkutPenerima: {
    type: Sequelize.STRING
  },
  benderaPenerima: {
    type: Sequelize.STRING
  },
  nomorVoyFlightPolPenerima: {
    type: Sequelize.STRING
  },
  reportId: {
    allowNull: false,
    type: Sequelize.INTEGER,
    references: {
      model: 'Reports',
      key: 'id'
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  }
}, {
  tableName: 'Penerima',
  freezeTableName:true,
})

module.exports = reportPenerima;