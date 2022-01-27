"use strict";
const Sequelize = require("sequelize");
const db = require("../../configs/database");

const ReceiveItems = db.define(
  "ReceiveItems",
  {
    idPo: {
      type: Sequelize.STRING,
      references: {
        model: "PurchaseOrder",
        key: "id",
      },
      onUpdate: "cascade",
      onDelete: "cascade",
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "cascade",
      onDelete: "cascade",
      allowNull: false,
    },
    tanggal: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    remarks: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    noReceive: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    isDelete: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "ReceiveItems",
    freezeTableName: true,
  }
);

module.exports = ReceiveItems;
