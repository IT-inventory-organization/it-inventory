'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Typo in Naming Table
     */
    await queryInterface.createTable('DataPetiKemasDanPengemas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      jumlahJenisKemasan: {
        type: Sequelize.INTEGER
      },
      jumlahPetiKemas: {
        type: Sequelize.INTEGER
      },
      jumlahJenisBarang: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('DataPetiKemasDanPengemas');
  }
};