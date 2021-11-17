'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const UserAvtivity = db.define('aktifitasUsers', {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'info_pengguna',
      key: 'id'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade'
  },
  reportId: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'reports',
      key: 'id'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade'
  },
  aktifitas: {
    type: Sequelize.STRING
  },
}, {
  tableName: 'aktifitasUsers',
  freezeTableName: true,
})

module.exports = UserAvtivity;