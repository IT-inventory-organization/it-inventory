'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('info_pengguna', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
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
    await queryInterface.dropTable('info_pengguna');
  }
};