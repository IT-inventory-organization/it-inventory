"use strict";
const Sequelize = require("sequelize");
const db = require("../../configs/database");

const UserPrivilages = db.define(
  "UserPrivilages",
  {
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    },
    accessModule: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    canRead: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    canInsert: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    canDelete: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    canUpdate: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    canPrint: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    isDelete: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "UserPrivilages",
    freezeTableName: true,
  }
);

module.exports = UserPrivilages;
