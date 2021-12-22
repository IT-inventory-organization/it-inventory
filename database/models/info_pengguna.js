'use strict';
// const { stringAt } = require('pdfkit/js/data');
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const infoPengguna = db.define('infoPengguna', {
  namaPerusahaan: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  npwp: {
    type: Sequelize.STRING
  },
  alamat: {
    type: Sequelize.STRING
  },
  nomorTelepon: {
    type: Sequelize.STRING
  },
  fax: {
    type: Sequelize.STRING
  },
  bidangUsaha: {
    type: Sequelize.STRING
  },
  namaPemilik: {
    allowNull: false,
    type: Sequelize.STRING
  },
  alamatPemilik: {
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
    type: Sequelize.STRING
  },
  username: {
    allowNull: false,
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