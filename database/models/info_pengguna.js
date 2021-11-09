'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const InfoPengguna = db.define('info_pengguna', {
  nama_perusahaan: {
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
  nomor_telepon: {
    allowNull: false,
    type: Sequelize.STRING
  },
  fax: {
    allowNull: true,
    type: Sequelize.STRING
  },
  bidang_usaha: {
    allowNull: false,
    type: Sequelize.STRING
  },
  nama_pemilik: {
    allowNull: false,
    type: Sequelize.STRING
  },
  alamat_pemilik: {
    allowNull: true,
    type: Sequelize.STRING
  },
  password: {
    allowNull: false,
    type: Sequelize.STRING
  },
  role_id: {
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