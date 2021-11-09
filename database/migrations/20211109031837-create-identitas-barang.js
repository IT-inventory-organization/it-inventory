'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('identitas_barang', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      negara_asal: {
        allowNull: true,
        type: Sequelize.STRING
      },
      jenis_barang: {
        type: Sequelize.STRING
      },
      nilai_barang: {
        type: Sequelize.INTEGER
      },
      cara_pembayaran: {
        type: Sequelize.STRING
      },
      asal_barang: {
        type: Sequelize.STRING
      },
      jumlah_barang: {
        type: Sequelize.INTEGER
      },
      reportId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'reports',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      jumlah_kemasan: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('identitas_barang');
  }
};