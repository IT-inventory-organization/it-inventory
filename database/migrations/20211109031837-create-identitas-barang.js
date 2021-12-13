'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('identitas_barang', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      negaraAsal: {
        allowNull: true,
        type: Sequelize.STRING
      },
      jenisBarang: {
        type: Sequelize.STRING
      },
      nilaiBarang: {
        type: Sequelize.INTEGER
      },
      caraPembayaran: {
        type: Sequelize.STRING
      },
      asalBarang: {
        type: Sequelize.STRING
      },
      jumlahBarang: {
        type: Sequelize.INTEGER
      },
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
      jumlahKemasan: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('identitas_barang');
  }
};