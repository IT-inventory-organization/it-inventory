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
      await queryInterface.addColumn('info_pengguna', 'email', {
        type: Sequelize.STRING
      }),
      await queryInterface.addColumn('info_pengguna', 'username', {
        type: Sequelize.STRING
      })
    ];
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
      await queryInterface.removeColumn('info_pengguna', 'email'),
      await queryInterface.removeColumn('info_pengguna', 'username')
    ];
    return Promise.all(promises)
  }
};
