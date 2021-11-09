'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('data_kapal', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      voyage_kapal: {
        type: Sequelize.STRING
      },
      bendera_kapal: {
        type: Sequelize.STRING
      },
      nama_kapal: {
        type: Sequelize.STRING
      },
      tanggal_kedatangan: {
        type: Sequelize.DATE
      },
      tanggal_keberangkatan: {
        type: Sequelize.DATE
      },
      reportId:{
        allowNull: false,
        type: Sequelize.INTEGER,
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
      }
    }, {
      freezeTableName: true
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('data_kapal');
  }
};