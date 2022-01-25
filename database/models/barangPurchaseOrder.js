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
      onUpdate: "cascade",
      onDelete: "cascade",
    },
  },
  {
    tableName: "BarangPurchaseOrder",
    freezeTableName: true,
  }
);

module.exports = BarangPurchaseOrder;
