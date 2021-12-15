'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bcf3315', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nomorPO: {
        type: Sequelize.STRING
      },
      tanggal: {
        type: Sequelize.DATEONLY
      },
      penanggungJawab: {
        type: Sequelize.STRING
      },
      jabatan: {
        type: Sequelize.STRING
      },
      npwp: {
        type: Sequelize.STRING
      },
      alamat: {
        type: Sequelize.STRING
      },
      nama: {
        type: Sequelize.STRING
      },
      lokasiPLB: {
        type: Sequelize.STRING
      },
      jenis: {
        type: Sequelize.STRING
      },
      ExHS4Digit: {
        type: Sequelize.INTEGER
      },
      persyaratanEkspor: {
        type: Sequelize.STRING
      },
      perkiraanJumlah: {
        type: Sequelize.INTEGER
      },
      satuan: {
        type: Sequelize.STRING
      },
      caraPengangkutan: {
        type: Sequelize.STRING
      },
      pelabuhanMuat: {
        type: Sequelize.STRING
      },
      tanggalPerkiraanPemasukanKePLB: {
        type: Sequelize.DATEONLY
      },
      namaPengangkutKeLuar: {
        type: Sequelize.STRING
      },
      voyage: {
        type: Sequelize.STRING
      },
      callSign: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, {
      freezeTableName: true
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('bcf3315');
  }
};