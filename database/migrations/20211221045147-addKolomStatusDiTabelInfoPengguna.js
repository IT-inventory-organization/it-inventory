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
      // await queryInterface.addColumn('infoPengguna', 'status', {
      //   type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
      //   defaultValue: 'ACTIVE'
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
    //  const promises = [
    //   await queryInterface.removeColumn('infoPengguna', 'status')
    // ];
    // return Promise.all(promises)
  }
};
