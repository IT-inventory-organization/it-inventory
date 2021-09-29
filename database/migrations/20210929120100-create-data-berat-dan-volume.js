'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DataBeratDanVolume', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      beratBersih: {
        type: Sequelize.DECIMAL
      },
      beratKotor: {
        type: Sequelize.DECIMAL
      },
      volume: {
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
    await queryInterface.dropTable('DataBeratDanVolume');
  }
};