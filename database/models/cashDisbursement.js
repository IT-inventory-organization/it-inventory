"use strict";
const Sequelize = require("sequelize");
const db = require("../../configs/database");

const CashDisbursement = db.define(
  "CashDisbursement",
  {
    code: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tanggal: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    deskripsi: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    jumlah: {
      type: Sequelize.DECIMAL,
      allowNull: false,
    },
    remarks: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    isDelete: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "cascade",
      onDelete: "no action",
    },
  },
  {
    tableName: "CashDisbursement",
    freezeTableName: true,
  }
);

module.exports = CashDisbursement;
