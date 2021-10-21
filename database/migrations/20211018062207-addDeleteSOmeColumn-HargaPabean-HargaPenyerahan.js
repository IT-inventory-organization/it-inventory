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
      await queryInterface.addColumn('listBarang', 'nilaiPabeanHargaPenyerahan', {
        type: Sequelize.DECIMAL,
      }),
      await queryInterface.removeColumn('Barang', 'nilaiPabeanHargaPenyerahan')
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
      await queryInterface.removeColumn('listBarang', 'nilaiPabeanHargapEnyerahan'),
      await queryInterface.addColumn('Barang', 'nilaiPabeanhargaPenyerahan', {
        type: Sequelize.DECIMAL
      })
    ]

    return Promise.all(promises)
  }
};
