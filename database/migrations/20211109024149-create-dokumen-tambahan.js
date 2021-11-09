'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('dokumen_tambahan', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nomorBC10: {
        allowNull: true,
        type: Sequelize.STRING
      },
      nomorBC11: {
        allowNull:true,
        type: Sequelize.STRING
      },
      nomorBL: {
        allowNull: true,
        type: Sequelize.STRING
      },
      tanggalBC10: {
        allowNull: true,
        type: Sequelize.STRING
      },
      tanggalBC11: {
        allowNull: true,
        type: Sequelize.STRING
      },
      tanggalBL: {
        allowNull: true,
        type: Sequelize.STRING
      },
      reportId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'reports',
          key: 'id'
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
    }, {
      freezeTableName: true
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('dokumen_tambahan');
  }
};