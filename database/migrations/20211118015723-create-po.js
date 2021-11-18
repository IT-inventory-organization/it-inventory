'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('po', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      kapalPemilik: {
        allowNull: false,
        type: Sequelize.STRING
      },
      kapalPembeli: {
        allowNull: false,
        type: Sequelize.STRING
      },
      tanggalPurchaseOerder: {
        allowNull: false,
        type: Sequelize.DATE
      },
      jumlahTotal: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      remarks: {
        allowNull: true,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    }, {
      freezeTableName: true
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('po');
  }
};