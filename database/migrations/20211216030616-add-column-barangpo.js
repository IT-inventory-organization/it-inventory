'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const query = [
      await queryInterface.addColumn('barangPO', 'satuanKemasan', {
        type: Sequelize.STRING
      }),
      await queryInterface.addColumn('barangPO', 'jumlah', {
        type: Sequelize.INTEGER
      })
    ];

    return Promise.all(query);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    const query = [
      await queryInterface.removeColumn('barangPO', 'satuanKemasan'),
      await queryInterface.removeColumn('barangPO', 'jumlah')
    ];

    return Promise.all(query);
  }
};
