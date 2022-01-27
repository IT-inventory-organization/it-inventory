"use strict";
const Sequelize = require("sequelize");
const db = require("../../configs/database");

const ReceivedItemsQty = db.define(
  "ReceivedItemsQty",
  {
    idReceive: {
      type: Sequelize.INTEGER,
      references: {
        model: "ReceiveItems",
        key: "id",
      },
      onUpdate: "cascade",
      onDelete: "cascade",
      allowNull: false,
    },
    quantityReceived: {
      type: Sequelize.DECIMAL,
      allowNull: false,
    },
    idBarangPo: {
      type: Sequelize.INTEGER,
      references: {
        model: "BarangPurchaseOrder",
        key: "id",
      },
      onUpdate: "cascade",
      onDelete: "cascade",
      allowNull: false,
    },
    isDelete: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "ReceivedItemsQty",
    freezeTableName: true,
  }
);

module.exports = ReceivedItemsQty;
