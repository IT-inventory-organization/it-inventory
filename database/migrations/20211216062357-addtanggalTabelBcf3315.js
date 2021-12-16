'use strict';

// const { promises } = require("nodemailer/lib/xoauth2");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const promise = [
      await queryInterface.addColumn('bcf3315', 'tanggal', {
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
      await queryInterface.removeColumn('bcf3315', 'tanggal')
    ]
    return Promise.all(promises)
  }
};
