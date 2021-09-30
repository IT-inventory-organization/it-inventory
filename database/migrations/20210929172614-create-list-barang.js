'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('listBarang', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      posTarif: {
        type: Sequelize.DECIMAL
      },
      uraian: {
        type: Sequelize.STRING
      },
      nettoBrutoVolume: {
        type: Sequelize.DECIMAL
      },
      satuanKemasan: {
        type: Sequelize.DECIMAL
      },
      nilaiPabeanHargaPenyerahan: {
        type: Sequelize.DECIMAL
      },
      reportId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Reports",
          key: "id"
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('listBarang');
  }
};