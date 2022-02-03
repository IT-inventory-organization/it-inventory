"use strict";
const Sequelize = require("sequelize");
const db = require("../../configs/database");

const BillPayment = db.define(
  "BillPayment",
  {
    idBill: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Bill",
        key: "id",
      },
      onDelete: "no action",
      onUpdate: "cascade",
    },
    tanggal: {
      type: Sequelize.DATEONLY,
      allowNull: false,
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
    remarks: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    total: {
      type: Sequelize.DECIMAL,
      allowNull: false,
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
    tableName: "BillPayment",
    freezeTableName: true,
  }
);

module.exports = BillPayment;
