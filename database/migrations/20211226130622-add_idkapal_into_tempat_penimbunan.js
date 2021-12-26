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
      await queryInterface.addColumn('tempatPenimbunan', 'idKapal', {
        type: Sequelize.INTEGER,
        allowNull: true
      }),
      await queryInterface.addConstraint('tempatPenimbunan', {
        type: 'foreign key',
        name: 'fkey_idkapal_from_tempatPenimbunan',
        fields: ['idKapal'],
        references: {
          table: 'dataKapal',
          field: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'no action'
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
      await queryInterface.removeConstraint('tempatPenimbunan', 'fkey_idkapal_from_tempatPenimbunan'),
      await queryInterface.removeColumn('tempatPenimbunan', 'idKapal'),
    ]

    return Promise.all(promises);
  }
};
