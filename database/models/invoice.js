"use strict";
const Sequelize = require("sequelize");
const db = require("../../configs/database");

const Invoice = db.define(
  "Invoice",
  {
    noInvoice: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    idDo: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "DeliveryOrder",
        key: "id",
      },
      onUpdate: "cascade",
      onDelete: "no action",
    },
    tanggalInvoice: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    jangkaWaktu: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    jangkaWaktuString: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    jatuhTempo: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    remarks: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    noRef: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    idContact: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "CardList",
        key: "id",
      },
      onUpdate: "cascade",
      onDelete: "no action",
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
    status: {
      type: Sequelize.STRING,
      defaultValue: "DRAFT",
    },
  },
  {
    tableName: "Invoice",
    freezeTableName: true,
  }
);

module.exports = Invoice;
