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
      await queryInterface.removeColumn('listBarang', 'nettoBrutoVolume'),
      await queryInterface.removeColumn('listBarang', 'hsCode'),
      await queryInterface.removeColumn('listBarang', 'nilaiPabeanHargaPenyerahan'),
      await queryInterface.removeColumn('listBarang', 'satuanKemasan'),
      await queryInterface.removeColumn('listBarang', 'uraian'),
      await queryInterface.removeColumn('listBarang', 'posTarif'),
      await queryInterface.addColumn('listBarang', 'idBarang', {
        type: Sequelize.INTEGER,
        references: {
          model: 'Barang',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),
      await queryInterface.addColumn('listBarang', 'quantity', {
        type: Sequelize.INTEGER
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
      await queryInterface.addColumn('listBarang', 'nettoBrutoVolume', {
        type: Sequelize.DECIMAL,
      }),
      await queryInterface.addColumn('listBarang', 'hsCode', {
        type: Sequelize.STRING,
      }),
      await queryInterface.addColumn('listBarang', 'nilaiPabeanHargaPenyerahan', {
        type: Sequelize.DECIMAL,
      }),
      await queryInterface.addColumn('listBarang', 'satuanKemasan', {
        type: Sequelize.STRING
      }),
      await queryInterface.addColumn('listBarang', 'uraian', {
        type: Sequelize.STRING
      }),
      await queryInterface.addColumn('listBarang', 'posTarif',{
        type: Sequelize.DECIMAL
      }),
      await queryInterface.removeColumn('listBarang', 'idBarang', {
        type: Sequelize.INTEGER,
        references: {
          model: 'Barang',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),
      await queryInterface.removeColumn('listBarang', 'quantity', {
        type: Sequelize.INTEGER
      })
    ];
    return Promise.all(promises)
  }
};
