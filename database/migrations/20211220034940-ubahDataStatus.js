'use strict';

// const { toDefaultValue } = require("sequelize/types/lib/utils");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const promises = [
        await queryInterface.changeColumn('bcf3315', 'status', {
        type: Sequelize.STRING,
         defaultValue: 'menunggu',
        allowNull: false
      })
    ]
    return Promise.all(promises)
  },

  // queryInterface.changeColumn('Person', 'foo', {
  //   type: DataTypes.FLOAT,
  //   defaultValue: 3.14,
  //   allowNull: false
  // });


  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    const promises = [
      // await queryInterface.changeColumn('bcf3315', 'nomorbcf3314'),
      await queryInterface.changeColumn('bcf3315', 'status', {
        type: Sequelize.DATEONLY,
        // defaultValue: 'menunggu',
        allowNull: false
      })
    ]
    return Promise.all(promises)
  }
};
