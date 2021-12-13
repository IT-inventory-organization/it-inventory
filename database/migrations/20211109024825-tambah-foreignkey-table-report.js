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
      await queryInterface.addColumn('reports', 'userId', {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'info_pengguna',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),
      await queryInterface.addColumn('reports', 'isDelete', {
        type: Sequelize.BOOLEAN
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
      await queryInterface.removeColumn('reports', 'userId'),
      await queryInterface.removeColumn('reports', 'isDelete')
    ]

    return Promise.all(promises)
  }
};
