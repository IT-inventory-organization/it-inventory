const Barang = require("../../database/models/barang");
const BarangPurchaseOrder = require("../../database/models/barangPurchaseOrder");
const Bill = require("../../database/models/bill");
const BillPriceItem = require("../../database/models/billPriceItem");
const CardList = require("../../database/models/cardList");
const PurchaseOrder = require("../../database/models/purchaseOrder");
const ReceiveItems = require("../../database/models/receivedItems");
const ReceivedItemsQty = require("../../database/models/receivedItemsQty");
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
        include: [
          {
            model: ReceivedItemsQty,
            attributes: ["quantityReceived"],
            where: {
              isDelete: false,
            },
            include: [
              {
                model: BarangPurchaseOrder,
                attributes: ["quantity"],
                where: {
                  isDelete: false,
                },
                include: [
                  {
                    model: Barang,
                    attributes: ["name"],
                    where: {
                      isDelete: false,
                    },
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
        include: [
          {
            model: PurchaseOrder,
            attributes: ["supplier", "nomorPO"],
            include: [
              {
                model: CardList,
                attributes: ["name"],
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
};
