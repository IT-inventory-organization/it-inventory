'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DataPengajuan', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      kantorPabeanAsal: {
        type: Sequelize.STRING
      },
      kategoryPemberitahuan: {
        type: Sequelize.STRING
      },
      kategoryPengeluaran: {
        type: Sequelize.STRING
      },
      tujuanPengeluaran: {
        type: Sequelize.STRING
      },
      asalBarang: {
        type: Sequelize.STRING
      },
      caraPembayaran: {
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
    await queryInterface.dropTable('DataPengajuan');
  }
};