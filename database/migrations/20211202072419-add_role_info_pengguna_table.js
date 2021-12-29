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
      // await queryInterface.addColumn('infoPengguna', 'roleEnum', {
      //   type: Sequelize.ENUM('SUPER_USER', 'ADMIN', 'BC', 'PLB'),
      //   defaultValue: 'ADMIN'
      // })
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
      await queryInterface.removeColumn('infoPengguna', 'roleEnum')
    ];
    return Promise.all(promises)
  }
};
