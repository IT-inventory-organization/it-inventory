'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('IdentitasPenerima', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      jenisIdentitasPenerima: {
        type: Sequelize.STRING
      },
      nomorIdentitasPenerima: {
        type: Sequelize.STRING
      },
      namaPenerima: {
        type: Sequelize.STRING
      },
      alamatPenerima: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('IdentitasPenerima');
  }
};