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
    // logging: console.log,
  });
};

const fetchNoInvoiceForReceivePayment = async (req, transaction = null) => {
  return Invoice.findAll({
    where: {
      userId: req.currentUser,
      isDelete: false,
      status: StatsInvoice.DRAFT,
    },
    attributes: ["noInvoice", "id"],
    transaction: transaction,
    include: [
      {
        model: ReceivePayment,
        attributes: ["id"],
        where: {
          isDelete: false,
        },
        required: false,
      },
    ],
  });
};

const fetchInvoiceForRecievePaymentAutoComplete = async (
  req,
  idInv,
  transaction = null
) => {
  return Invoice.findOne({
    where: {
      id: idInv,
      userId: req.currentUser,
      isDelete: false,
    },
    attributes: ["noInvoice", "id"],
    transaction: transaction,
    include: [
      // Get Supplier
      {
        model: DeliveryOrder,
        attributes: ["id"],
        include: [
          {
            model: SalesOrder,
            attributes: ["idContact"],
            where: { isDelete: false },
            include: [
              {
                model: CardList,
                where: { isDelete: false },
                attributes: ["name", "id"],
                required: false,
              },
            ],
          },
        ],
      },
      // // Get Barang
      {
        model: InvoiceDetail,
        where: {
          isDelete: false,
        },
        attributes: ["idDOBarang"],
        include: [
          {
            model: DeliveryOrderBarang,
            where: {
              isDelete: false,
            },
            attributes: ["quantityReceived"],
            include: [
              {
                model: SalesOrderBarang,
                where: {
                  isDelete: false,
                },
                attributes: ["jumlah"], // Nilai Yang Akan Dihitung
              },
            ],
          },
        ],
      },
      {
        model: ReceivePayment,
        where: {
          isDelete: false,
        },
        required: false,
        attributes: ["id"],
        include: [
          {
            model: ReceivePaymentDetail,
            required: false,
            where: {
              isDelete: false,
            },
            attributes: ["id", "jumlahTotal"], // Jika Ada Nilai
          },
        ],
      },
    ],
  });
};

module.exports = {
  ViewOneList,
  ViewAllList,
  fetchNoInvoiceForReceivePayment,
  fetchInvoiceForRecievePaymentAutoComplete,
};
