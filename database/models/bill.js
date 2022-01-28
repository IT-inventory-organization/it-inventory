"use strict";
const Sequelize = require("sequelize");
const db = require("../../configs/database");

const Bill = db.define(
  "Bill",
  {
    idReceive: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: "ReceiveItems",
        key: "id",
      },
      onDelete: "no action",
      onUpdate: "cascade",
    },
    noTransaksi: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    remarks: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    total: {
      type: Sequelize.DECIMAL,
      allowNull: false,
    },
    isDelete: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "no action",
      onUpdate: "cascade",
      allowNull: false,
    },
  },
  {
    tableName: "Bill",
    freezeTableName: true,
  }
);

module.exports = Bill;
