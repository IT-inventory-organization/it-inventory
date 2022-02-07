"use strict";
const Sequelize = require("sequelize");
const db = require("../../configs/database");

const ReceivePaymentDetail = db.define(
  "ReceivePaymentDetail",
  {
    idReceivePayment: {
      type: Sequelize.INTEGER,
      references: {
        model: "ReceivePayment",
        key: "id",
      },
      onUpdate: "cascade",
      onDelete: "no action",
      allowNull: false,
    },
    idInvItem: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "InvoiceDetail",
        key: "id",
      },
      onUpdate: "cascade",
      onDelete: "no action",
    },
    deskripsi: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    jumlah: {
      type: Sequelize.DECIMAL,
      allowNull: false,
    },
    jumlahTotal: {
      type: Sequelize.DECIMAL,
      allowNull: true,
    },
    totalPenerimaan: {
      type: Sequelize.DECIMAL,
      allowNull: false,
    },
    isDelete: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "ReceivePaymentDetail",
    freezeTableName: true,
  }
);

module.exports = ReceivePaymentDetail;
