'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addConstraint('bcf3315', {
      type: 'FOREIGN KEY',
      name: 'fkey_poId_to_po',
      fields: ['poId'],
      references: {
        table: 'po',
        field: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'no action'
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint('bcf3315', 'fkey_poId_to_po')
  }
};
