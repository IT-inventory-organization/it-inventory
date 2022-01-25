"use strict";
const Sequelize = require("sequelize");
const db = require("../../configs/database");

const Report = db.define(
  "Report",
  {
    pengajuanSebagai: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    kantorPengajuan: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    jenisPemberitahuan: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    jenisMasuk: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    isEditable: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    },
    status: {
      type: Sequelize.STRING,
    },
    typeReport: {
      type: Sequelize.STRING,
    },
    BCDocumentType: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    isDelete: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    nomorAjuan: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "Reports",
    freezeTableName: true,
  }
);

module.exports = Report;
