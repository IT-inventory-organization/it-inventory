'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const InfoPengguna = db.define('info_pengguna', {
  namaPerusahaan: {
    allowNull: false,
    type: Sequelize.STRING
  },
  npwp: {
    allowNull: false,
    type: Sequelize.STRING
  },
  alamat: {
    allowNull: false,
    type: Sequelize.STRING
  },
  nomorTelepon: {
    allowNull: false,
    type: Sequelize.STRING
  },
  fax: {
    allowNull: true,
    type: Sequelize.STRING
  },
  bidangUsaha: {
    allowNull: false,
    type: Sequelize.STRING
  },
  namaPemilik: {
    allowNull: false,
    type: Sequelize.STRING
  },
  alamatPemilik: {
    allowNull: true,
    type: Sequelize.STRING
  },
  password: {
    allowNull: false,
    type: Sequelize.STRING
  },
  roleId: {
    type: Sequelize.INTEGER,
    defaultValue: 2,
    allowNull: false
  },
  email: {
    allowNull: false,
    type: Sequelize.STRING
  },
  username: {
    allowNull: true,
    type: Sequelize.STRING
  }
}, {
  tableName: 'info_pengguna',
  freezeTableName: true,
})

module.exports = InfoPengguna;