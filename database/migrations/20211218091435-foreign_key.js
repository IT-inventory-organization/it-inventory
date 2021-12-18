'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addConstraint('barangPO', {
      type: 'foreign key',
      name: 'fkey_constraint_idBarang',
      fields: ['idBarang'],
      references: {
        table: 'dataBarang',
        field: 'id'
      },
      onDelete: 'no action',
      onUpdate: 'cascade'
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint('barangPO', 'fkey_constraint_idBarang');
  }
};
