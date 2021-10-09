'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('TransaksiPerdagangan', 'kursNDPBM' , {
      type: Sequelize.DECIMAL
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('TransaksiPerdagangan', 'kursNDPBM', {
      type: Sequelize.INTEGER
    })
  }
};
