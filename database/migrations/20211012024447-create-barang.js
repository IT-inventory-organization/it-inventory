'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Barang', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      posTarif: {
        type: Sequelize.DECIMAL
      },
      hsCode: {
        type: Sequelize.STRING
      },
      uraian: {
        type: Sequelize.STRING
      },
      nettoBrutoVolume: {
        type: Sequelize.DECIMAL
      },
      satuanKemasan: {
        type: Sequelize.STRING
      },
      nilaiPabeanHargaPenyerahan: {
        type: Sequelize.DECIMAL
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      isDelete: {
        type: Sequelize.BOOLEAN
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id"
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
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
      freezeTableName:true
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Barang');
  }
};