"use strict";
const sequelize = require("sequelize");
const Sequelize = require("sequelize");
const db = require("../../configs/database");

const BillPaymentItems = db.define(
  "BillPaymentItems",
  {
    idBillPayment: {
      type: Sequelize.INTEGER,
      references: {
        model: "BillPayment",
        key: "id",
      },
      onDelete: "no action",
      onUpdate: "cascade",
      allowNull: false,
    },
    isDelete: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    idBillItem: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "BillPriceItem",
        key: "id",
      },
      onUpdate: "cascade",
      onDelete: "no action",
    },
  },
  {
    tableName: "BillPaymentItems",
    freezeTableName: true,
  }
);

module.exports = BillPaymentItems;
