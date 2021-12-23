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
      await queryInterface.addColumn('bcf3315', 'userId', {
        type: Sequelize.INTEGER,
        allowNull: true
      }),
      await queryInterface.addConstraint('bcf3315', {
        type: 'foreign key',
        name: 'fkey_constraint_userId_bcf3315',
        fields: ['userId'],
        references: {
          table: 'infoPengguna',
          field: 'id'
        },
        onDelete: 'no action',
        onUpdate: 'cascade'
      }),
      await queryInterface.addColumn('bcf3315', 'isDelete', {
        type: Sequelize.BOOLEAN,
        allowNull: true
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
      await queryInterface.removeColumn('bcf3315', 'isDelete'),
      await queryInterface.removeColumn('bcf3315', 'userId'),
    ];

    return Promise.all(promises)
  }
};
