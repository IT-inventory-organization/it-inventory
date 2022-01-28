"use strict";
const Sequelize = require("sequelize");
const db = require("../../configs/database");

const PurchaseOrder = db.define(
  "PurchaseOrder",
  {
    nomorPO: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tanggal: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    supplier: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    total: {
      type: Sequelize.DECIMAL,
      allowNull: false,
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
    idContactCard: {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        model: "CardList",
        key: "ID",
      },
      onDelete: "no action",
      onUpdate: "cascade",
    },
  },
  {
    tableName: "PurchaseOrder",
    freezeTableName: true,
  }
);

module.exports = PurchaseOrder;
