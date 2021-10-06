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
      await queryInterface.addColumn('Reports', "typeReport", {
        type: Sequelize.STRING
      }),
      await queryInterface.addColumn('Reports', "BCDocumentType", {
        type: Sequelize.STRING
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
      await queryInterface.removeColumn('Reports', "typeReport"),
      await queryInterface.removeColumn("Reports", "BCDocumentType")
    ];

    return Promise.all(promiseToResolve);
  }
};
