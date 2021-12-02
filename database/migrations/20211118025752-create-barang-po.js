'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('barangPO', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      poId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'po',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      idBarang: {
        type: Sequelize.INTEGER
      },
      quantity: {
        type: Sequelize.DECIMAL
      },
      kodeBarang: {
        type: Sequelize.STRING
      },
      itemDeskripsi: {
        type: Sequelize.STRING
      },
      hargaSatuan: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('barangPO');
  }
};