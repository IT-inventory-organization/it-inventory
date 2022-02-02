"use strict";
const Sequelize = require("sequelize");
const db = require("../../configs/database");

const SalesOrder = db.define(
  "SalesOrder",
  {
    noSalesOrder: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tanggalOrder: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    total: {
      type: Sequelize.DECIMAL,
      allowNull: true,
    },
    remarks: {
      type: Sequelize.STRING,
      allowNull: true,
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
    idContact: {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        model: "CardList",
        key: "id",
      },
      onDelete: "no action",
      onUpdate: "cascade",
    },
  },
  {
    tableName: "SalesOrder",
    freezeTableName: true,
  }
);

module.exports = SalesOrder;
