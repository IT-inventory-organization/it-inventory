'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addConstraint('Users', {
      fields: ['role_id'], 
      type: 'FOREIGN KEY',
      name: 'FK_Users_to_Roles',
      references: {
        table: 'Roles',
        field: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'

    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint('Users', 'FK_Users_to_Roles')
  }
};
