"use strict";
const Sequelize = require("sequelize");
const db = require("../../configs/database");

const BillPriceItem = db.define(
  "BillPriceItem",
  {
    idBill: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: "Bill",
        key: "id",
      },
      onDelete: "no action",
      onUpdate: "cascade",
    },
    hargaSatuan: {
      type: Sequelize.DECIMAL,
      allowNull: false,
    },
    jumlah: {
      type: Sequelize.DECIMAL,
      allowNull: false,
      defaultValue: 0,
    },
    isDelete: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    idReceiveQtyItem: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "ReceivedItemsQty",
        key: "id",
      },
    },
  },
  {
    tableName: "BillPriceItem",
    freezeTableName: true,
  }
);

module.exports = BillPriceItem;
