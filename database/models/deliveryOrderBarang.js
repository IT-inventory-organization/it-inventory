"use strict";
const Sequelize = require("sequelize");
const db = require("../../configs/database");

const DeliveryOrderBarang = db.define(
  "DeliveryOrderBarang",
  {
    idDo: {
      type: Sequelize.INTEGER,
      references: {
        model: "DeliveryOrder",
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
    idSOBarang: {
      type: Sequelize.INTEGER,
      references: {
        model: "SalesOrderBarang",
        key: "id",
      },
      onUpdate: "cascade",
      onDelete: "no action",
      allowNull: false,
    },
    isDelete: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "DeliveryOrderBarang",
    freezeTableName: true,
  }
);

module.exports = DeliveryOrderBarang;
