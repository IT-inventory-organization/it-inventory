'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     const promises = [
      await queryInterface.addColumn('adjustmentBarang', 'dataBarangId', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'dataBarang',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      })
    ];
    return Promise.all(promises)
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     const promises = [
      await queryInterface.removeColumn('adjustmentBarang', 'dataBarangId')
    ];
    return Promise.all(promises)
  }
};
