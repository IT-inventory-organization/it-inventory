'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

<<<<<<< HEAD
const infoPengguna = db.define('infoPengguna', {
=======
const InfoPengguna = db.define('infoPengguna', {
>>>>>>> 6d782c229cd74d123cf78a190c4a867db2cdc978
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
    allowNull: false,
    type: Sequelize.INTEGER,
    references: {
      model: 'roles',
      key: 'id'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade',
    defaultValue: 2
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
  tableName: 'infoPengguna',
  freezeTableName: true,
})

module.exports = infoPengguna;