'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('produksiBarangDetail', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      produksiBarangId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'produksiBarang',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      dataBarangId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'dataBarang',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      kodeBarang: {
        type: Sequelize.STRING
      },
      deskripsi: {
        allowNull: true,
        type: Sequelize.STRING
      },
      quantity: {
        type: Sequelize.DECIMAL
      },
      jumlah: {
        type: Sequelize.DECIMAL
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    }, {
      freezeTableName: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('produksiBarangDetail');
  }
};
