'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('histories', 'reportId', {
      allowNull: true,
      type: Sequelize.INTEGER,
      references: {
        model: "Reports",
        key: "id"
      },
      onDelete: 'cascade',
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
    await queryInterface.changeColumn('histories', 'reportId', {
      allowNull: true,
      type: Sequelize.INTEGER,
      references: {
        model: "Reports",
        key: "id"
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  }
};
