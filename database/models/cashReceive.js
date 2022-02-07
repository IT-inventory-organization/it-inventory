"use strict";
const Sequelize = require("sequelize");
const db = require("../../configs/database");

const CashReceive = db.define(
  "CashReceive",
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
  },
  {
    tableName: "CashReceive",
    freezeTableName: true,
  }
);

module.exports = CashReceive;
