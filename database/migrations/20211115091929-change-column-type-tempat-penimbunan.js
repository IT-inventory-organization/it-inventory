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
      // await queryInterface.changeColumn('tempatPenimbunan', 'perkiraanTanggalPengeluaran', {
      //   type: 'DATE USING CAST("perkiraanTanggalPengeluaran" AS DATE)'
      // }),
      await queryInterface.changeColumn('tempatPenimbunan', 'perkiraanTanggalPengeluaran', {
        type: Sequelize.DATEONLY
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
      await queryInterface.changeColumn('tempatPenimbunan', 'perkiraanTanggalPengeluaran', {
        type: Sequelize.DATE
      })
    ]
    
    return Promise.all(promises);
  }
};
