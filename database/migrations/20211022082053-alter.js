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
      await queryInterface.renameColumn('IdentitasPenerima', 'jenisIdentitasPenerima', 'jenisIdentitasPPJK'),
      await queryInterface.renameColumn('IdentitasPenerima', 'nomorIdentitasPenerima', 'nomorIdentitasPPJK'),
      await queryInterface.renameColumn('IdentitasPenerima', 'namaPenerima', 'namaPPJK'),
      await queryInterface.renameColumn('IdentitasPenerima', 'alamatPenerima', 'alamatPPJK'),
      await queryInterface.removeConstraint('IdentitasPenerima', 'IdentitasPenerima_reportId_fkey'),
      await queryInterface.renameTable('IdentitasPenerima', 'IdentitasPPJK'),
      await queryInterface.addConstraint('IdentitasPPJK', {
        fields: ['reportId'],
        type: 'FOREIGN KEY',
        name: 'FK_PPJK',
        references: {
          table: 'Reports',
          field: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
  
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
      await queryInterface.renameColumn('IdentitasPPJK', 'jenisIdentitasPPJK', 'jenisIdentitasPenerima'),
      await queryInterface.renameColumn('IdentitasPPJK', 'nomorIdentitasPPJK', 'nomorIdentitasPenerima'),
      await queryInterface.renameColumn('IdentitasPPJK', 'namaPPJK', 'namaPenerima'),
      await queryInterface.renameColumn('IdentitasPPJK', 'alamatPPJK', 'alamatPenerima'),
      await queryInterface.removeConstraint('IdentitasPPJK', 'FK_PPJK'),
      await queryInterface.renameTable('IdentitasPPJK', 'IdentitasPenerima'),
      await queryInterface.addConstraint('IdentitasPenerima', {
        fields: ['reportId'], 
        type: 'FOREIGN KEY',
        name: 'IdentitasPenerima_reportId_fkey',
        references: {
          table: 'Reports',
          field: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
  
      })
    ]

    return Promise.all(promises);
  }
};
