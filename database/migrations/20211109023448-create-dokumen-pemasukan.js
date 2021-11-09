'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('dokumen_pemasukan', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      nomorDokumenPemasukan: {
        allowNull: false,
        type: Sequelize.STRING
      },
      tanggalDokumenPemasukan: {
        allowNull: false,
        type: Sequelize.DATE
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
    await queryInterface.dropTable('dokumen_pemasukan');
  }
};