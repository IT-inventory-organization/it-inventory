"use strict";
const Sequelize = require("sequelize");
const db = require("../../configs/database");

const DeliveryOrder = db.define(
  "DeliveryOrder",
  {
    nomorDO: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    tanggal: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    idSo: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "SalesOrder",
        key: "id",
      },
      onUpdate: "cascade",
      onDelete: "no action",
    },
    remarks: {
      type: Sequelize.STRING,
      allowNull: true,
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
    tableName: "DeliveryOrder",
    freezeTableName: true,
  }
);

module.exports = DeliveryOrder;
