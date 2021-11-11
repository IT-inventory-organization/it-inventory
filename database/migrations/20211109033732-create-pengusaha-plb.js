'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pengusaha_PLB', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      jenisIdentitasPengusahaPLB: {
        type: Sequelize.STRING
      },
      namaPengusahaPLB: {
        type: Sequelize.STRING
      },
      nomorIdentitasPegusahaPLB: {
        type: Sequelize.STRING
      },
      alamatPengusahaPLB: {
        type: Sequelize.STRING
      },
      reportId: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
      },
    }, {
      freezeTableName: true
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('pengusaha_PLB');
  }
};