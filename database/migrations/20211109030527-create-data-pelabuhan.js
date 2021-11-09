'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('data_pelabuhan', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pelabuhan: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      // Foreign Key
      reportId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'reports',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
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
      freezeTableName:true
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('data_pelabuhan');
  }
};