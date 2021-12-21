'use strict';
// const { stringAt } = require('pdfkit/js/data');
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const infoPengguna = db.define('infoPengguna', {
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
  },
  roleEnum: {
    allowNull: false,
    type: Sequelize.ENUM('SUPER_USER', 'ADMIN', 'BC', 'PLB'),
    defaultValue: 'ADMIN'
  },
  isActive: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'infoPengguna',
  freezeTableName: true,
})

module.exports = infoPengguna;