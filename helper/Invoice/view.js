const Barang = require("../../database/models/barang");
const CardList = require("../../database/models/cardList");
const DeliveryOrder = require("../../database/models/deliveryOrder");
const DeliveryOrderBarang = require("../../database/models/deliveryOrderBarang");
const Invoice = require("../../database/models/invoice");
const InvoiceDetail = require("../../database/models/invoiceDetail");
const SalesOrder = require("../../database/models/salesOrder");
const SalesOrderBarang = require("../../database/models/salesOrderBarang");

const ViewOneList = async (req, idInv, transaction = null) => {
  return Invoice.findOne({
    where: {
      userId: req.currentUser,
      id: idInv,
      isDelete: false,
    },
    attributes: {
      exclude: ["createdAt", "updatedAt", "isDelete", "userId"],
    },
    include: [
      {
        model: InvoiceDetail,
        where: {
          isDelete: false,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "isDelete"],
        },
        include: [
          {
            model: DeliveryOrderBarang,
            where: {
              isDelete: false,
            },
            attributes: ["quantityReceived", "id"],
            include: [
              {
                model: SalesOrderBarang,
                where: { isDelete: false },
                attributes: ["hargaSatuan", "jumlah", "id"],
                include: [
                  {
                    model: Barang,
                    where: {
                      isDelete: false,
                    },
                    attributes: [["satuanKemasan", "item"], "name"],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        model: CardList,
        where: {
          isDelete: false,
        },
        attributes: ["name", "id"],
      },
      {
        model: DeliveryOrder,
        required: false,
        where: {
          isDelete: false,
        },
        attributes: ["nomorDO", "id"],
      },
    ],
    transaction: transaction,
  });
};

const ViewAllList = async (req, transaction = null) => {
  return Invoice.findAll({
    where: {
      userId: req.currentUser,
      isDelete: false,
    },
    transaction: transaction,
    attributes: ["noInvoice", "id", "tanggalInvoice"],
    include: [
      {
        model: DeliveryOrder,
        attributes: ["nomorDO", "id"],
        where: {
          isDelete: false,
        },
      },
    ],
  });
};

module.exports = {
  ViewOneList,
  ViewAllList,
};
