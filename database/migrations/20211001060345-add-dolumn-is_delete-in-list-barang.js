'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
      const promiseToResolve = [
        await queryInterface.addColumn('listBarang', "isDelete", {
          type: Sequelize.BOOLEAN
        })
      ];

      return Promise.all(promiseToResolve);
    
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    const promiseToResolve = [
      await queryInterface.removeColumn('listBarang', "isDelete")
    ];

    return Promise.all(promiseToResolve);
  }
};
