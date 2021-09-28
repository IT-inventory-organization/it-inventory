'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('IdentitasPengirim', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      jenisIdentitasPengirim: {
        type: Sequelize.STRING
      },
      nomorIdentitasPengirim: {
        type: Sequelize.STRING
      },
      namaPengirim: {
        type: Sequelize.STRING
      },
      alamatPengirim: {
        type: Sequelize.STRING
      },
      nomorIjinBpkPengirim: {
        type: Sequelize.STRING
      },
      tanggalIjinBpkPengirim: {
        type: Sequelize.DATEONLY
      },
      reportId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Reports",
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
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('IdentitasPengirim');
  }
};