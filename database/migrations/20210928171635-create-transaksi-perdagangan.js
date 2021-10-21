'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TransaksiPerdagangan', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      transaksi: {
        type: Sequelize.STRING
      },
      transaksiLainnya: {
        type: Sequelize.STRING
      },
      valuta: {
        type: Sequelize.STRING
      },
      kursNDPBM: {
        type: Sequelize.INTEGER
      },
      cif: {
        type: Sequelize.DECIMAL
      },
      voluntaryDeclaration: {
        type: Sequelize.STRING
      },
      freight: {
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
    await queryInterface.dropTable('TransaksiPerdagangan');
  }
};