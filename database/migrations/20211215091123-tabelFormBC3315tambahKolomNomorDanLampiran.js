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
      await queryInterface.addColumn('bcf3315', 'nomorFormBC3315', {
        type: Sequelize.INTEGER
      }),
      await queryInterface.addColumn('bcf3315', 'lampiran', {
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
      await queryInterface('bcf3315', 'nomorFormBC3315'),
      await queryInterface('bcf3315', 'lampiran')
    ]
    return Promise.all(promises)
  }
};
