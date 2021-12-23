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
      await queryInterface.changeColumn('bcf3315', 'nomorbcf3314', {
        type: Sequelize.STRING,
        defaultValue: '',
        allowNull: true
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
      await queryInterface.changeColumn('bcf3315', 'nomorbcf3314', {
        defaultValue: null,
        allowNull: false
      })
    ]
    return Promise.all(promises)
  }
};
