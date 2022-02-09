"use strict";
const Sequelize = require("sequelize");
const db = require("../../configs/database");

const UserActivity = db.define(
  "UserActivity",
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
    reportId: {
      type: Sequelize.INTEGER,
      references: {
        model: "Reports",
        key: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
      allowNull: true,
    },
    activity: {
      type: Sequelize.STRING,
    },
    sourceId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    sourceType: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "UserActivities",
  }
);

module.exports = UserActivity;
