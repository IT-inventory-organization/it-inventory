'use strict';

// const { DataTypes } = require("sequelize/types");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const promises =[
      await queryInterface.addColumn('bcf3315', 'poId', {
        type: Sequelize.INTEGER
      }),
      // await queryInterface.removeColumn('bcf3315', 'jenis'),
      // await queryInterface.removeColumn('bcf3315', 'ExHS4Digit'),
      // await queryInterface.removeColumn('bcf3315', 'persyaratanEkspor'),
      // await queryInterface.removeColumn('bcf3315', 'perkiraanJUmlah'),
      // await queryInterface.removeColumn('bcf3315', 'satuan'),
      await queryInterface.addColumn('bcf3315', 'nomorbcf3314', {
        type: Sequelize.STRING
      }),
      await queryInterface.changeColumn('bcf3315', 'nomorbcf3314', {
        type: Sequelize.STRING,
        defaultValue: 'menunggu',
        allowNull: false
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
      // await queryInterface.removeColumn('bcf3315', 'poId'),
      // await queryInterface.addColumn('bcf3315', 'jenis'),
      // await queryInterface.addColumn('bcf3315', 'ExHS4Digit'),
      // await queryInterface.addColumn('bcf3315', 'persyaratanEkspor'),
      // await queryInterface.addColumn('bcf3315', 'perkiraanJUmlah'),
      // await queryInterface.addColumn('bcf3315', 'satuan'),
      await queryInterface.changeColumn('bcf3315', 'nomorbcf3314')
    ]
    return Promise.all(promises)
  }
};
