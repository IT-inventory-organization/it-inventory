const Barang = require("../../database/models/barang");
const CardList = require("../../database/models/cardList");
const DeliveryOrder = require("../../database/models/deliveryOrder");
const SalesOrder = require("../../database/models/salesOrder");
const SalesOrderBarang = require("../../database/models/salesOrderBarang");
const httpStatus = require("../Httplib");
const { errorResponse } = require("../Response");

const ListSalesOrder = async (req, res, transaction = null) => {
  try {
    return SalesOrder.findAll({
      where: {
        userId: req.currentUser,
        isDelete: false,
      },
      attributes: ["noSalesOrder", "tanggalOrder", "total", "id"],
      include: [
        {
          model: CardList,
          required: true,
          where: {
            isDelete: false,
          },
          attributes: ["name", ["_ID", "ID"]],
        },
      ],
      transaction: transaction,
    });
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed TO Fetch List Sales Order"
    );
  }
};

const ViewOneSalesOrder = async (req, idSo, transaction = null) => {
  try {
    return SalesOrder.findOne({
      where: {
        id: idSo,
        userId: req.currentUser,
        isDelete: false,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId", "isDelete"],
      },
      include: [
        {
          model: CardList,
          where: {
            isDelete: false,
          },
          attributes: ["name", ["_ID", "ID"]],
        },
        {
          model: SalesOrderBarang,
          where: {
            isDelete: false,
          },
          attributes: {
            exclude: ["createdAt", "updatedAt", "isDelete"],
          },
          required: false,
          include: [
            {
              model: Barang,
              where: {
                isDelete: false,
              },
              attributes: [
                "name",
                "satuanKemasan",
                "id",
                "cbm",
                ["nettoBrutoVolume", "brt"],
              ],
            },
          ],
        },
      ],
      transaction: transaction,
    });
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed TO Fetch One Sales Order"
    );
  }
};

const FetchListOfSalesOrder = async (req, transaction) => {
  return SalesOrder.findAll({
    where: {
      isDelete: false,
      userId: req.currentUser,
    },
    attributes: ["noSalesOrder", "id"],
    include: [
      {
        model: DeliveryOrder,
        required: false,
      },
    ],
    transaction: transaction,
  });
};

const FetchingDataForDeliveryOrder = async (req, idSo, transaction = null) => {
  return SalesOrder.findOne({
    where: {
      isDelete: false,
      userId: req.currentUser,
      id: idSo,
    },
    attributes: ["id", "noSalesOrder"],
    include: [
      {
        model: CardList,
        attributes: ["name", ["_ID", "ID"], "id"],
        where: {
          isDelete: false,
        },
        required: true,
      },
      {
        model: SalesOrderBarang,
        where: {
          isDelete: false,
        },
        attributes: ["quantity", ["id", "idSOBarang"]],
        include: [
          {
            model: Barang,
            where: {
              isDelete: false,
            },
            attributes: [
              "name",
              "satuanKemasan",
              "id",
              "cbm",
              ["nettoBrutoVolume", "brt"],
            ],
          },
        ],
      },
    ],
    transaction: transaction,
  });
};

module.exports = {
  ListSalesOrder,
  ViewOneSalesOrder,
  FetchListOfSalesOrder,
  FetchingDataForDeliveryOrder,
};
