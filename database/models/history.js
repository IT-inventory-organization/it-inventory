"use strict";
const Sequelize = require("sequelize");
const db = require("../../configs/database");

const Histories = db.define(
  "histories",
  {
    reportId: {
      allowNull: true,
      type: Sequelize.INTEGER,
      references: {
        model: "Reports",
        key: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    },
    idBarang: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: "Barang",
        key: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    },
    quantityItem: {
      type: Sequelize.INTEGER,
    },
    status: {
      type: Sequelize.STRING,
    },
    desc: {
      type: Sequelize.STRING,
    },
    sourceId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    sourceType: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "cascade",
      onDelete: "cascade",
    },
  },
  {
    tableName: "histories",
    freezeTableName: true,
  }
);

module.exports = Histories;
