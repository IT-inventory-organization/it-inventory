'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('adjustmentBarang', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      namaBarang: {
        type: Sequelize.STRING
      },
      nomorAdjustment: {
        type: Sequelize.STRING
      },
      tanggalAdjustment: {
        type: Sequelize.DATEONLY
      },
      quantity: {
        type: Sequelize.DECIMAL
      },
      remarks: {
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
    await queryInterface.dropTable('adjustmentBarang');
  }
};