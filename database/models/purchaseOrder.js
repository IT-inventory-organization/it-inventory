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
    kapalPenjual: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    total: {
      type: Sequelize.DECIMAL,
      allowNull: false,
    },
    remarks: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    // reportId: {
    //   allowNull: false,
    //   type: Sequelize.INTEGER,
    //   references: {
    //     model: "Reports",
    //     key: "id",
    //   },
    //   onDelete: "cascade",
    //   onUpdate: "cascade",
    // },
  },
  {
    tableName: "PurchaseOrder",
    freezeTableName: true,
  }
);

module.exports = PurchaseOrder;
