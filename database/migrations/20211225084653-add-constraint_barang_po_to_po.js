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
      type: 'FOREIGN KEY',
      fields: ['poId'],
      name: 'fkey_barangPO_to_po',
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
    await queryInterface.removeConstraint('barangPO', 'fkey_barangPO_to_po');
  }
};
