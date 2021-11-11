'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('mata_uang', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      valuta: {
        type: Sequelize.STRING
      },
      freight: {
        type: Sequelize.INTEGER
      },
      ndbpmKurs: {
        type: Sequelize.DECIMAL
      },
      cif: {
        type: Sequelize.DECIMAL
      },
      transaksiLainnya: {
        type: Sequelize.STRING
      },
      hargaPenyerahan: {
        type: Sequelize.DECIMAL
      },
      reportId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'reports',
          key:'id'
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
      freezeTableName: true
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('mata_uang');
  }
};