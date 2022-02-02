const Barang = require("../../database/models/barang");
const CardList = require("../../database/models/cardList");
const DeliveryOrder = require("../../database/models/deliveryOrder");
const DeliveryOrderBarang = require("../../database/models/deliveryOrderBarang");
const SalesOrder = require("../../database/models/salesOrder");
const SalesOrderBarang = require("../../database/models/salesOrderBarang");

const ViewList = async (req, transaction = null) => {
  return DeliveryOrder.findAll({
    where: {
      userId: req.currentUser,
      isDelete: false,
    },
    attributes: ["nomorDO", "tanggal"],
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
    // logging: console.log,
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
        attributes: ["noSalesOrder", "id"],
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
                where: {
                  isDelete: false,
                },
                attributes: ["name", "satuanKemasan"],
              },
            ],
          },
        ],
      },
    ],
    transaction: transaction,
  });
};

module.exports = {
  ViewList,
  ViewOneList,
};
