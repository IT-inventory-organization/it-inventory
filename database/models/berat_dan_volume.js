'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const beratDanVolume = db.define('beratDanVolume', {
  beratMuatan: {
    type: Sequelize.DECIMAL
  },
  beratKapalDenganMuatan: {
    type: Sequelize.DECIMAL
  },
  volume: {
    type: Sequelize.DECIMAL
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
  tableName: 'beratDanVolume',
  freezeTableName: true,
})

module.exports = beratDanVolume;