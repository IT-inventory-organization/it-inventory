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
      await queryInterface.changeColumn('bcf3315', 'status', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: false
      }),
      await queryInterface.changeColumn('bcf3315', 'nomorbcf3314', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: false
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
    const promise = [
      await queryInterface.changeColumn('bcf3314', 'status', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'menunggu'
      }),
      await queryInterface.changeColumn('bcf3314', 'nomorbcf3314', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'menunggu'
      })
    ]
    return Promise.all(promise)
  }
};
