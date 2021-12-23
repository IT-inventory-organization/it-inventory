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
      await queryInterface.addConstraint('bcf3315', {
        type: 'foreign key',
        name: 'fkey_constraint_poId_bcf3315',
        fields: ['poId'],
        references: {
          table: 'po',
          field: 'id'
        },
        onDelete: 'no action',
        onUpdate: 'cascade'
      }),
      await queryInterface.changeColumn('bcf3315', 'isDelete', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
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
      await queryInterface.removeConstraint('bcf3315', 'fkey_constraint_poId_bcf3315'),
      await queryInterface.changeColumn('bcf3315', 'isDelete', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: ''
      })
    ];
    return Promise.all(promises)
  }
};
