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
      caraAngkutPenerima: {
        type: Sequelize.STRING
      },
      namaPengangkutPenerima: {
        type: Sequelize.STRING
      },
      benderaPenerima: {
        type: Sequelize.STRING
      },
      nomorVoyFlightPolPenerima: {
        type: Sequelize.STRING
      },
      reportId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Reports',
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
    await queryInterface.dropTable('IdentitasPenerima');
  }
};