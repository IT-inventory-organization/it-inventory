"use strict";
const sequelize = require("sequelize");
const Sequelize = require("sequelize");
const db = require("../../configs/database");

const SalesOrderBarang = db.define(
  "SalesOrderBarang",
  {
    idSo: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "SalesOrder",
        key: "id",
      },
      onDelete: "no action",
      onUpdate: "cascade",
    },
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
    isDelete: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "SalesOrderBarang",
    freezeTableName: true,
  }
);

module.exports = SalesOrderBarang;
