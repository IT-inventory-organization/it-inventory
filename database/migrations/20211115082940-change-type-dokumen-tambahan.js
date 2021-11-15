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
      await queryInterface.changeColumn("dokumenTambahan", "tanggalBC10", {
        type: 'DATE USING CAST("tanggalBC10" as DATE)',
      }),
      await queryInterface.changeColumn("dokumenTambahan", "tanggalBC10", {
        type: Sequelize.DATEONLY,
      }),
      await queryInterface.changeColumn("dokumenTambahan", "tanggalBC11", {
        type: 'DATE USING CAST("tanggalBC10" as DATE)',
      }),
      await queryInterface.changeColumn("dokumenTambahan", "tanggalBC11", {
        type: Sequelize.DATEONLY,
      }),
      await queryInterface.changeColumn("dokumenTambahan", "tanggalBL", {
        type: 'DATE USING CAST("tanggalBC10" as DATE)',
      }),
      await queryInterface.changeColumn("dokumenTambahan", "tanggalBL", {
        type: Sequelize.DATEONLY,
      }),
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
      await queryInterface.changeColumn('dokumenTambahan', 'tanggalBC10', {
        type: Sequelize.STRING
      }),
      await queryInterface.changeColumn('dokumenTambahan', 'tanggalBC11', {
        type: Sequelize.STRING
      }),
      await queryInterface.changeColumn('dokumenTambahan', 'tanggalBL', {
        type: Sequelize.STRING
      }),
    ];
    return Promise.all(promises)
  }
};
