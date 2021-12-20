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
      await queryInterface.addColumn('bcf3315', 'status', {type: Sequelize.STRING}),
      await queryInterface.addColumn('bcf3315', 'nomorbcf3314', {
        type: Sequelize.DATE
      })
    ]
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
      await queryInterface.removeColumn('bcf3315', 'status'),
      await queryInterface.removeColumn('bcf3315', 'nomorbcf3314')
    ]
    return Promise.all(promises)
  }
};
