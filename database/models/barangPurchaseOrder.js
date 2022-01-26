"use strict";
const sequelize = require("sequelize");
const Sequelize = require("sequelize");
const db = require("../../configs/database");

const BarangPurchaseOrder = db.define(
  "BarangPurchaseOrder",
  {
    idBarang: {
      type: Sequelize.INTEGER,
      references: {
        model: "Barang",
        key: "id",
      },
      onDelete: "no action",
      onUpdate: "cascade",
      allowNull: false,
    },
    quantity: {
      type: Sequelize.DECIMAL,
      allowNull: false,
    },
    hargaSatuan: {
      type: sequelize.DECIMAL,
      allowNull: false,
    },
    jumlah: {
      type: Sequelize.DECIMAL,
      allowNull: false,
    },
    idPo: {
      type: sequelize.INTEGER,
      references: {
        model: "PurchaseOrder",
        key: "id",
      },
      onUpdate: "no action",
      onDelete: "cascade",
      allowNull: false,
    },
    isDelete: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "BarangPurchaseOrder",
    freezeTableName: true,
  }
);

module.exports = BarangPurchaseOrder;
