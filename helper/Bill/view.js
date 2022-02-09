const Barang = require("../../database/models/barang");
const BarangPurchaseOrder = require("../../database/models/barangPurchaseOrder");
const Bill = require("../../database/models/bill");
const BillPayment = require("../../database/models/billPayment");
const BillPriceItem = require("../../database/models/billPriceItem");
const CardList = require("../../database/models/cardList");
const PurchaseOrder = require("../../database/models/purchaseOrder");
const ReceiveItems = require("../../database/models/receivedItems");
const ReceivedItemsQty = require("../../database/models/receivedItemsQty");
const SalesOrder = require("../../database/models/salesOrder");
const { CardUserType } = require("../cardUserType.enum");

const ViewOneBill = async (req, idBill, transaction = null) => {
  return Bill.findOne({
    where: {
      id: idBill,
      userId: req.currentUser,
      isDelete: false,
    },
    attributes: [
      "idReceive",
      "tanggal",
      "supplier",
      "noTransaksi",
      "id",
      "total",
      "remarks",
    ],
    include: [
      {
        model: ReceiveItems,
        where: {
          isDelete: false,
        },
        attributes: ["noReceive"],
      },
      {
        model: BillPriceItem,
        attributes: ["hargaSatuan", "jumlah", "id"],
        where: {
          isDelete: false,
        },
        include: [
          {
            model: ReceivedItemsQty,
            attributes: ["quantityReceived", ["id", "idReceiveQtyItem"]],
            where: {
              isDelete: false,
            },
            include: [
              {
                model: BarangPurchaseOrder,
                attributes: ["quantity", "hargaSatuan"],
                where: {
                  isDelete: false,
                },
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
    ],
    transaction: transaction,
  });
};

const ViewListOfBill = async (req, transaction = null) => {
  return Bill.findAll({
    where: {
      userId: req.currentUser,
      isDelete: false,
    },
    transaction: transaction,
    attributes: ["tanggal", "supplier", "id"],
    include: [
      // Barang
      {
        model: BillPriceItem,
        attributes: ["jumlah"],
        where: {
          isDelete: false,
        },
        required: false,
        include: [
          {
            model: ReceivedItemsQty,
            attributes: ["quantityReceived"],
            required: false,
            where: {
              isDelete: false,
            },
            include: [
              {
                model: BarangPurchaseOrder,
                attributes: ["quantity"],
                required: false,
                where: {
                  isDelete: false,
                },
                include: [
                  {
                    model: Barang,
                    attributes: ["name"],
                    required: false,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        model: ReceiveItems,
        attributes: ["noReceive"],
        required: false,
        include: [
          {
            model: PurchaseOrder,
            attributes: ["supplier", "nomorPO"],
            required: false,
            include: [
              {
                model: CardList,
                required: false,
                attributes: ["name"],
              },
            ],
          },
        ],
      },
    ],
  });
};

const fetchNoTransaksiForBillPayment = async (req, transaction = null) => {
  return Bill.findAll({
    where: {
      userId: req.currentUser,
      isDelete: false,
    },
    attributes: ["noTransaksi", "id"],
    transaction: transaction,
    include: [
      {
        model: BillPayment,
        required: false,
        where: {
          isDelete: false,
        },
      },
    ],
  });
};

const fetchBillForBillPaymentAutoComplete = async (
  req,
  idBill,
  transaction = null
) => {
  return Bill.findOne({
    where: {
      id: idBill,
      userId: req.currentUser,
      isDelete: false,
    },
    attributes: ["noTransaksi", "id"],
    transaction: transaction,
    include: [
      // Get Supplier
      {
        model: ReceiveItems,
        attributes: ["id"],
        include: [
          {
            model: PurchaseOrder,
            attributes: ["idContactCard", "supplier"],
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
      // Get Barang
      {
        model: BillPriceItem,
        attributes: ["hargaSatuan", "jumlah", "id"],
        where: { isDelete: false },
        include: [
          {
            model: ReceivedItemsQty,
            attributes: ["quantityReceived", "id"],
            where: { isDelete: false },
            include: [
              {
                model: BarangPurchaseOrder,
                where: { isDelete: false },
                attributes: ["id", "quantity"],
                include: [
                  {
                    model: Barang,
                    attributes: [["satuanKemasan", "item"], "name", "id"],
                    // where: { isDelete: false }, // Double Check
                    required: false,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  });
};

module.exports = {
  ViewOneBill,
  ViewListOfBill,
  fetchNoTransaksiForBillPayment,
  fetchBillForBillPaymentAutoComplete,
};
