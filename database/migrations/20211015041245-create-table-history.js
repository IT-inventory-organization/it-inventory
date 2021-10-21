'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('histories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      reportId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        referecenes: {
          model: 'Report',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      idBarang: {
        allowNull: false,
        type: Sequelize.INTEGER,
        referecenes: {
          model:'Barang',
          key: 'id',
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
    await queryInterface.dropTable('histories');
  }
};