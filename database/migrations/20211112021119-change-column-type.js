'use strict';

const sequelize = require("../../configs/database");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const promises = [
      await queryInterface.changeColumn('identitas_barang', 'nilaiBarang', {
        type: Sequelize.DECIMAL,
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
      await queryInterface.changeColumn('identitas_barang', 'nilaiBarang', {
        type: Sequelize.INTEGER
      })
    ];
    return Promise.all(promises)
  }
};
