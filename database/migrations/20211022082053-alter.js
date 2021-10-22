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
      await queryInterface.renameTable('IdentitasPenerima', 'PPJK'),
      await queryInterface.addConstraint('PPJK', {
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
      await queryInterface.renameColumn('PPJK', 'jenisIdentitasPPJK', 'jenisIdentitasPenerima'),
      await queryInterface.renameColumn('PPJK', 'nomorIdentitasPPJK', 'nomorIdentitasPenerima'),
      await queryInterface.renameColumn('PPJK', 'namaPPJK', 'namaPenerima'),
      await queryInterface.renameColumn('PPJK', 'alamatPPJK', 'alamatPenerima'),
      await queryInterface.removeConstraint('PPJK', 'FK_PPJK'),
      await queryInterface.renameTable('PPJK', 'IdentitasPenerima'),
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
