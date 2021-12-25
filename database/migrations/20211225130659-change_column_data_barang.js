'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('dataBarang', 'nilaiPabeanHargaPenyerahan', {
      type: Sequelize.DECIMAL,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.changeColumn('dataBarang', 'nilaiPabeanHargaPenyerahan', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  }
};
