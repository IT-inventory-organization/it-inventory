"use strict";
const Sequelize = require("sequelize");
const db = require("../../configs/database");

const Barang = db.define(
  "Barang",
  {
    name: Sequelize.STRING,
    posTarif: Sequelize.DECIMAL,
    hsCode: Sequelize.STRING,
    uraian: Sequelize.STRING,
    nettoBrutoVolume: Sequelize.DECIMAL,
    satuanKemasan: Sequelize.STRING,
    // nilaiPabeanHargaPenyerahan: Sequelize.DECIMAL,
    stock: Sequelize.INTEGER,
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
      onDelete: "cascade",
      onUpdate: "cascade",
    },
    cbm: {
      type: Sequelize.DECIMAL,
      allowNull: false,
    },
  },
  {
    modelName: "Barang",
    freezeTableName: true,
  }
);

module.exports = Barang;
