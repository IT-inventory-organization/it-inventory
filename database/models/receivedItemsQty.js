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
  },
  {
    tableName: "ReceivedItemsQty",
    freezeTableName: true,
  }
);

module.exports = ReceivedItemsQty;
