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
      await queryInterface.renameColumn('Users', 'address', 'address_company'), // Alamat Perusahaan
      await queryInterface.renameColumn('Users', 'name', 'owner_name'), // Nama Pemilik
      await queryInterface.addColumn('Users','address_owner', {
        allowNull: true,
        type: Sequelize.STRING,
      }),
      await queryInterface.addColumn('Users','company_name', {
        allowNull: true,
        type: Sequelize.STRING
      }),
      await queryInterface.addColumn('Users','business_field',{
        allowNull: true,
        type: Sequelize.STRING
      })
    ]

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
      await queryInterface.renameColumn('Users','address_company', 'address'), // Alamat Perusahaan
      await queryInterface.renameColumn('Users','owner_name', 'name'), // Nama Pemilik
      // await queryInterface.addColumn('address_owner', {
      //   type: Sequelize.STRING,
      // }),
      // await queryInterface.addColumn('company_name', {
      //   type: Sequelize.STRING
      // }),
      // await queryInterface.addColumn('business_field',{
      //   type: Sequelize.STRING
      // })
      await queryInterface.removeColumn('Users','address_owner'),
      await queryInterface.removeColumn('Users','company_name'),
      await queryInterface.removeColumn('Users','business_field')
    ]

    return Promise.all(promises);
  }
};
