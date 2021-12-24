'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('produksiBarang', 'isDelete', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.removeColumn('produksiBarang', 'isDelete', {
      type: Sequelize.BOOLEAN,
      defaultValue: '',
      allowNull: true
    })
  }
};
