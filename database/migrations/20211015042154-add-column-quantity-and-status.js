'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const promise = [
      await queryInterface.addColumn('histories', 'quantityItem', {
        type: Sequelize.INTEGER
      }),
      await queryInterface.addColumn('histories', 'status', {
        type: Sequelize.STRING
      })
    ];

    return Promise.all(promise);
    
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     const promise = [
      await queryInterface.removeColumn('histories', 'quantityItem'),
      await queryInterface.removeColumn('histories', 'status')
    ];

    return Promise.all(promise);
  }
};
