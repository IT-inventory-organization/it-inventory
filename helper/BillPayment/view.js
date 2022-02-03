const Barang = require("../../database/models/barang");
const BarangPurchaseOrder = require("../../database/models/barangPurchaseOrder");
const Bill = require("../../database/models/bill");
const BillPayment = require("../../database/models/billPayment");
const BillPaymentItems = require("../../database/models/billPaymentItems");
const BillPriceItem = require("../../database/models/billPriceItem");
const CardList = require("../../database/models/cardList");
const PurchaseOrder = require("../../database/models/purchaseOrder");
const ReceiveItems = require("../../database/models/receivedItems");
const ReceivedItemsQty = require("../../database/models/receivedItemsQty");

const ViewAllList = async (req, transaction = null) => {
  return BillPayment.findAll({
    where: {
      userId: req.currentUser,
      isDelete: false,
    },
    attributes: ["noInvoice", "tanggal", "id"],
    include: [
      {
        model: CardList,
        where: {
          isDelete: false,
        },
        attributes: ["name", "id"],
      },
      {
        model: BillPaymentItems,
        where: {
          isDelete: false,
        },
        attributes: ["id"],
        include: [
          {
            model: BillPriceItem,
            attributes: ["id", "hargaSatuan", "jumlah"],
            where: {
              isDelete: false,
            },
            include: [
              {
                model: ReceivedItemsQty,
                attributes: ["quantityReceived", "id"],
                where: {
                  isDelete: false,
                },
                include: [
                  {
                    model: BarangPurchaseOrder,
                    attributes: ["id"],
                    include: [
                      {
                        model: Barang,
                        attributes: ["name"],
                      },
                    ],
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

const ViewOne = async (req, idBillPayment, transaction = null) => {
  return BillPayment.findOne({
    where: {
      userId: req.currentUser,
      isDelete: false,
    },
    attributes: {
      exclude: ["createdAt", "updatedAt", "isDelete", "userId"],
    },
    include: [
      {
        model: CardList,
        attributes: ["name", "id"],
        where: {
          isDelete: false,
        },
      },
      {
        model: Bill,
        attributes: ["noTransaksi"],
        where: {
          isDelete: false,
        },
      },
      {
        model: BillPaymentItems,
      },
    ],
  });
};
