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
      ndbpm_kurs: {
        type: Sequelize.DECIMAL
      },
      cif: {
        type: Sequelize.DECIMAL
      },
      transaksi_lainnya: {
        type: Sequelize.STRING
      },
      harga_penyerahan: {
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