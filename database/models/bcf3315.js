'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const bcf3315 = db.define('bcf3315', {
  nomorPo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  tanggal: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  penanggungJawab: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  jabatan: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  npwp: {
    type: Sequelize.STRING
  },
  alamat: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  nama: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lokasiPLB: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  jenis: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  ExHS4Digit: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  persyaratanEkspor: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  perkiraanJUmlah: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  satuan: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  caraPengangkutan: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  pelabuhanMuat: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  tanggalPerkiraanPemasukanKePLB: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  namaPengangkutKeLuar: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  voyage: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  callSign: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  // Foreign Key
  // reportId: {
  //   allowNull: false,
  //   type: Sequelize.INTEGER,
  //   references: {
  //     model: 'reports',
  //     key: 'id'
  //   },
  //   onUpdate: 'cascade',
  //   onDelete: 'cascade'
  // },
}, {
  tableName: 'bcf3315',
  freezeTableName: true,
})

module.exports = bcf3315;