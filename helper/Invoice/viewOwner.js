const Barang = require("../../database/models/barang");
const BarangPurchaseOrder = require("../../database/models/barangPurchaseOrder");
const BillPriceItem = require("../../database/models/billPriceItem");
const CardList = require("../../database/models/cardList");
const DeliveryOrder = require("../../database/models/deliveryOrder");
const DeliveryOrderBarang = require("../../database/models/deliveryOrderBarang");
const Invoice = require("../../database/models/invoice");
const InvoiceDetail = require("../../database/models/invoiceDetail");
const ReceivedItemsQty = require("../../database/models/receivedItemsQty");
const ReceivePayment = require("../../database/models/receivePayment");
const ReceivePaymentDetail = require("../../database/models/receivePaymentDetail");
const SalesOrder = require("../../database/models/salesOrder");
const SalesOrderBarang = require("../../database/models/salesOrderBarang");
const { StatsInvoice } = require("../Activity.interface");

module.exports = {
  FindInvoiceWithABoss: async (idInv = null, transaction = null) => {
    const DeliveryOrderInclude = {
      model: DeliveryOrder,
      required: false,
      where: {
        isDelete: false,
      },
      attributes: ["nomorDO", "id"],
    };
    const Include = [
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
                    attributes: [["satuanKemasan", "item"], "name", "cbm"],
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
      DeliveryOrderInclude,
    ];

    if (idInv) {
      return Invoice.findOne({
        where: {
          id: +idInv,
          isDelete: false,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "isDelete", "userId"],
        },
        include: [...Include],
      });
    }

    return Invoice.findAll({
      where: {
        isDelete: false,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "isDelete", "userId"],
      },
      include: [DeliveryOrderInclude],
    });
  },
};
