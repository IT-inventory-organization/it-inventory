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
      await queryInterface.addColumn('bcf3315', 'reportId', {
        type: Sequelize.INTEGER,
        allowNull: true
      }),
      await queryInterface.addConstraint('bcf3315', {
        type: 'foreign key',
        name: 'fkey_bcf3315_to_report',
        fields: ['reportId'],
        references: {
          table: 'report',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    ];

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
      await queryInterface.removeConstraint('bcf3315', 'fkey_bcf3315_to_report'),
      await queryInterface.removeColumn('bcf3315', 'reportId'),
    ];

    return Promise.all(promises); 
  }
};
