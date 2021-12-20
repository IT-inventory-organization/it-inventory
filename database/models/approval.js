'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const approval = db.define('approval', {
  status: {
    type: Sequelize.ENUM('DISETUJUI', 'PERBAIKAN', 'MENUNGGU'),
    defaultValue: 'MENUNGGU',
  },
  bcfId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'bcf3315',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'infoPengguna',
      key: 'id'
    },
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION'
  },
  alasan: {
    type: Sequelize.TEXT,
    allowNull: true
  }
}, {
  tableName: 'approval',
  freezeTableName: true,
});

module.exports = approval;