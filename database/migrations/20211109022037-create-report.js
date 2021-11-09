'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('reports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      jenisPemberitahuan: {
        type: Sequelize.STRING
      },
      diAjukanDiKantor: {
        type: Sequelize.STRING
      },
      jenisDokumenBC: {
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
      freezeTableName: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('reports');
  }
};