"use strict";
const Sequelize = require("sequelize");
const db = require("../../configs/database");

const SaldoAwal = db.define(
  "SaldoAwal",
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
    tableName: "SaldoAwal",
    freezeTableName: true,
  }
);

module.exports = SaldoAwal;
