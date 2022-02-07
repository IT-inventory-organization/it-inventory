"use strict";
const Sequelize = require("sequelize");
const db = require("../../configs/database");

const ReceivePayment = db.define(
  "ReceivePayment",
  {
    idInv: {
      type: Sequelize.INTEGER,
      references: {
        model: "Invoice",
        key: "id",
      },
      onUpdate: "cascade",
      onDelete: "no action",
      allowNull: false,
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
    idContact: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "CardList",
        key: "id",
      },
      onUpdate: "cascade",
      onDelete: "no action",
    },
    tanggal: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    metodePembayaran: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    noReferensi: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    remarks: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    isDelete: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    noReceive: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "ReceivePayment",
    freezeTableName: true,
  }
);

module.exports = ReceivePayment;
