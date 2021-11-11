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