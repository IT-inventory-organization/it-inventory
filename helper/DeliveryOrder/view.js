const Barang = require("../../database/models/barang");
const CardList = require("../../database/models/cardList");
const DeliveryOrder = require("../../database/models/deliveryOrder");
const DeliveryOrderBarang = require("../../database/models/deliveryOrderBarang");
const Invoice = require("../../database/models/invoice");
const SalesOrder = require("../../database/models/salesOrder");
const SalesOrderBarang = require("../../database/models/salesOrderBarang");

const ViewList = async (req, transaction = null) => {
  return DeliveryOrder.findAll({
    where: {
      userId: req.currentUser,
      isDelete: false,
    },
    attributes: ["nomorDO", "tanggal", "id"],
    include: [
      {
        model: SalesOrder,
        required: true,
        where: {
          isDelete: false,
        },
        attributes: ["noSalesOrder", "id"],
        include: [
          {
            model: CardList,
            where: {
              isDelete: false,
            },
            attributes: ["name", ["_ID", "ID"], "id"],
          },
        ],
      },
      {
        model: DeliveryOrderBarang,
        attributes: ["quantityReceived"],
        where: {
          isDelete: false,
        },
      },
    ],
    transaction: transaction,
  });
};

const ViewOneList = async (req, idDo, transaction = null) => {
  return DeliveryOrder.findOne({
    where: {
      id: idDo,
      isDelete: false,
      userId: req.currentUser,
    },
    attributes: {
      exclude: ["createdAt", "updatedAt", "isDelete", "userId"],
    },
    include: [
      {
        model: SalesOrder,
        where: {
          isDelete: false,
        },
        attributes: ["noSalesOrder", "id", "tanggalOrder"],
        include: [
          {
            model: CardList,
            attributes: ["name", ["_ID", "ID"], "id"],
          },
        ],
      },
      {
        model: DeliveryOrderBarang,
        where: { isDelete: false },
        attributes: {
          exclude: ["createdAt", "updatedAt", "isDelete"],
        },
        include: [
          {
            model: SalesOrderBarang,
            where: { isDelete: false },
            attributes: ["id"],
            include: [
              {
                model: Barang,
                attributes: [
                  "name",
                  "satuanKemasan",
                  "cbm",
                  ["nettoBrutoVolume", "brt"],
                ],
              },
            ],
          },
        ],
      },
    ],

    transaction: transaction,
  });
};

const ViewListNoDeliveryOrder = async (req, transaction = null) => {
  return DeliveryOrder.findAll({
    where: {
      userId: req.currentUser,
      isDelete: false,
    },
    attributes: ["nomorDO", "id"],
    include: [
      {
        model: Invoice,
        required: false,
        where: {
          isDelete: false,
        },
        attributes: ["id"],
      },
    ],
  });
};

const ViewListAutoComplete = async (req, idDo, transaction = null) => {
  return DeliveryOrder.findOne({
    where: {
      userId: req.currentUser,
      id: idDo,
      isDelete: false,
    },
    attributes: ["nomorDO", "id"],
    include: [
      {
        model: DeliveryOrderBarang,
        where: {
          isDelete: false,
        },
        required: false,
        attributes: ["quantityReceived", "id"],
        include: [
          {
            model: SalesOrderBarang,
            where: {
              isDelete: false,
            },
            attributes: ["quantity", "hargaSatuan", "jumlah", "id"],
            include: [
              {
                model: Barang,
                attributes: ["satuanKemasan", "name", "cbm"],
              },
            ],
          },
        ],
      },
      {
        model: SalesOrder,
        where: { isDelete: false },
        attributes: ["idContact", "id"],
        include: [
          {
            model: CardList,
            where: { isDelete: false },
            attributes: ["name", "id"],
          },
        ],
      },
    ],
  });
};

module.exports = {
  ViewList,
  ViewOneList,
  ViewListNoDeliveryOrder,
  ViewListAutoComplete,
};
