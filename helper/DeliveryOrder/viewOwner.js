const e = require("express");
const Seq = require("sequelize");
const Barang = require("../../database/models/barang");
const CardList = require("../../database/models/cardList");
/**
 * @type {Seq.Model}
 */
const DeliveryOrder = require("../../database/models/deliveryOrder");
const DeliveryOrderBarang = require("../../database/models/deliveryOrderBarang");
const Invoice = require("../../database/models/invoice");
const SalesOrder = require("../../database/models/salesOrder");
const SalesOrderBarang = require("../../database/models/salesOrderBarang");

const FindDeliveryOrder = async (idDo = null, transaction = null) => {
  const SalesOrderInclude = {
    model: SalesOrder,
    where: {
      isDelete: false,
    },
    attributes: ["noSalesOrder", "id", "tanggalOrder", "total"],
    include: [
      {
        model: CardList,
        attributes: ["name", ["_ID", "ID"], "id"],
      },
    ],
  };

  const SalesOrderBarangInclude = {
    model: SalesOrderBarang,
    where: { isDelete: false },
    attributes: ["id"],
    include: [
      {
        model: Barang,
        attributes: [
          "id",
          "name",
          "satuanKemasan",
          "cbm",
          ["nettoBrutoVolume", "brt"],
        ],
      },
    ],
  };

  const DeliveryOrderBarangInclude = {
    model: DeliveryOrderBarang,
    where: { isDelete: false },
    attributes: {
      exclude: ["createdAt", "updatedAt", "isDelete"],
    },
    include: [SalesOrderBarangInclude],
  };

  if (idDo) {
    return DeliveryOrder.findOne({
      where: {
        id: +idDo,
        isDelete: false,
        "$SalesOrder.isDelete$": false,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "isDelete", "userId"],
      },
      include: [SalesOrderInclude, DeliveryOrderBarangInclude],
    });
  }

  return DeliveryOrder.findAll({
    where: {
      isDelete: false,
      "$SalesOrder.isDelete$": false,
    },
    attributes: {
      exclude: ["createdAt", "updatedAt", "isDelete", "userId"],
    },
    include: [SalesOrderInclude, DeliveryOrderBarangInclude],
  });
};

module.exports = {
  FindDeliveryOrder,
};
