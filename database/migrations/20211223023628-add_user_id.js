'use strict';

const sequelize = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const promises = [
      await queryInterface.addColumn('po', 'userId', {
        type: Sequelize.INTEGER,
        allowNull: true
      }),
      await queryInterface.addConstraint('po', {
        type: 'foreign key',
        name: 'fkey_constraint_userId_Po',
        fields: ['userId'],
        references: {
          table: 'infoPengguna',
          field: 'id'
        },
        onDelete: 'no action',
        onUpdate: 'cascade'
      })
    ]

    return Promise.all(promises);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     const promises = [
      await queryInterface.removeConstraint('po', 'fkey_constraint_userId_Po'),
      await queryInterface.removeColumn('po', 'userId'),
    ]

    return Promise.all(promises);
  }
};
