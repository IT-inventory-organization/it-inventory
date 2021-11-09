'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pengusaha_PLB', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      jenis_identitas_pengusaha_PLB: {
        type: Sequelize.STRING
      },
      nama_pengusaha_PLB: {
        type: Sequelize.STRING
      },
      nomor_identitas_pegusaha_PLB: {
        type: Sequelize.STRING
      },
      alamat_pengusaha_PLB: {
        type: Sequelize.STRING
      },
      report_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'reports',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    }, {
      freezeTableName: true
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('pengusaha_PLB');
  }
};