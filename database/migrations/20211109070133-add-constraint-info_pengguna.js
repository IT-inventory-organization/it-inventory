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
      await queryInterface.addColumn('info_pengguna', 'roleId', {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'roles',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),
      await queryInterface.addColumn('info_pengguna', 'isActive', {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
      await queryInterface.removeColumn('info_pengguna', 'role_id'),
      await queryInterface.removeColumn('info_pengguna', 'is_active')
    ];

    return Promise.all(promises)
  }
};
