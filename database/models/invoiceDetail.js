"use strict";
const Sequelize = require("sequelize");
const db = require("../../configs/database");

const InvoiceDetail = db.define(
  "InvoiceDetail",
  {
    idInv: {
      type: Sequelize.INTEGER,
      references: {
        model: "Invoice",
        key: "id",
      },
      onUpdate: "cascade",
      onDelete: "no action",
      allowNull: false,
    },
    idDOBarang: {
      type: Sequelize.INTEGER,
      references: {
        model: "DeliveryOrderBarang",
        key: "id",
      },
      onUpdate: "cascade",
      onDelete: "cascade",
      allowNull: false,
    },
    isDelete: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "InvoiceDetail",
    freezeTableName: true,
  }
);

module.exports = InvoiceDetail;
