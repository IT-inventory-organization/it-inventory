"use strict";
const Seq = require("sequelize");

const Table1 = "DeliveryOrder";
const Table2 = "Invoice";

module.exports = {
  /**
   *
   * @param {Seq.QueryInterface} queryInterface
   * @param {Seq} Sequelize
   */
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn(Table1, "approve", {
      allowNull: true,
      type: Sequelize.BOOLEAN,
    });

    await queryInterface.addColumn(Table2, "approve", {
      allowNull: true,
      type: Sequelize.BOOLEAN,
    });
  },
  /**
   *
   * @param {Seq.QueryInterface} queryInterface
   * @param {Seq} Sequelize
   */
  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn(Table1, "approve");
    await queryInterface.removeColumn(Table2, "approve");
  },
};
