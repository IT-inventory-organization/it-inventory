'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.removeColumn('infoPengguna', 'roleEnum');
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.addColumn('infoPengguna', 'roleEnum', {
      type: Sequelize.ENUM('SUPER_USER', 'ADMIN', 'BC', 'PLB'),
      defaultValue: 'ADMIN'
    })
  }
};
