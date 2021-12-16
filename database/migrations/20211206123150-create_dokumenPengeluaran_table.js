'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('dokumenPengeluaran', {
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
          model: 'report',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      dokumenPemasukanId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'dokumenPemasukan',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      nomorDokumen: {
        allowNull: false,
        type: Sequelize.STRING
      },
      tanggalDokumen: {
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
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('dokumenPengeluaran');
  }
};
