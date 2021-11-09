'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('data_barang', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      kode_barang: {
        type: Sequelize.STRING
      },
      nama_barang: {
        type: Sequelize.STRING
      },
      uraian: {
        type: Sequelize.STRING
      },
      netto_brutto_volume: {
        type: Sequelize.DECIMAL
      },
      satuan_kemasan: {
        type: Sequelize.STRING
      },
      stock: {
        type: Sequelize.DECIMAL
      },
      pos_tarif: {
        type: Sequelize.STRING
      },
      bm: {
        type: Sequelize.DECIMAL
      },
      ppn: {
        type: Sequelize.DECIMAL
      },
      ppnbm: {
        type: Sequelize.DECIMAL
      },
      cukai: {
        type: Sequelize.DECIMAL
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
    await queryInterface.dropTable('data_barang');
  }
};