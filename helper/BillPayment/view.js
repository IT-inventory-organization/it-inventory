const sequelize = require("../../configs/database");
const Barang = require("../../database/models/barang");
const BarangPurchaseOrder = require("../../database/models/barangPurchaseOrder");
const Bill = require("../../database/models/bill");
const BillPayment = require("../../database/models/billPayment");
const BillPaymentItems = require("../../database/models/billPaymentItems");
const BillPriceItem = require("../../database/models/billPriceItem");
const CardList = require("../../database/models/cardList");
const ReceivedItemsQty = require("../../database/models/receivedItemsQty");

const ViewAllList = async (req, transaction = null) => {
  return BillPayment.findAll({
    where: {
      userId: req.currentUser,
      isDelete: false,
    },
    attributes: ["tanggal", "id", "total"],
    include: [
      {
        model: CardList,
        where: {
          isDelete: false,
        },
        attributes: ["name", "id"],
      },
      {
        model: Bill,
        where: {
          isDelete: false,
        },
        attributes: ["noTransaksi"],
      },
    ],
    transaction: transaction,
  });
};

const ViewList = async (idBillPayment, transaction = null) => {
  return sequelize.query(`
    SELECT b."name", riq."quantityReceived"  FROM "BillPaymentItems" as bpi
    INNER JOIN "BillPriceItem" as bpit ON bpi."idBillItem" = bpit."id" AND bpi."isDelete" = false
    INNER JOIN "ReceivedItemsQty" as riq ON bpit."idReceiveQtyItem" = riq."id" AND riq."isDelete" = false
    INNER JOIN "BarangPurchaseOrder" as bpo ON riq."idBarangPo" = bpo."id" AND bpo."isDelete" = false
    LEFT OUTER JOIN "Barang" as b on bpo."idBarang" = b."id"
    WHERE bpi."idBillPayment" = ${idBillPayment} and bpi."isDelete" = false
  `);
};

const ViewOne = async (req, idBillPayment, transaction = null) => {
  return BillPayment.findOne({
    where: {
      id: idBillPayment,
      userId: req.currentUser,
      isDelete: false,
    },
    transaction: transaction,
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
        attributes: ["noTransaksi", "id"],
        where: {
          isDelete: false,
        },
      },
      {
        model: BillPaymentItems,
        attributes: ["id"],
        where: {
          isDelete: false,
        },
        include: [
          {
            model: BillPriceItem,
            attributes: ["hargaSatuan", "jumlah"],
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
      },
    ],
  });
};

const ViewOneQuery = async (req, idBillPayment, transaction = null) => {
  return BillPayment.findOne({
    where: {
      id: idBillPayment,
      userId: req.currentUser,
      isDelete: false,
    },
    transaction: transaction,
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
        attributes: ["noTransaksi", "id"],
        where: {
          isDelete: false,
        },
      },
    ],
  });
};

const ViewItemQuery = async (req, idBillPayment, transaction = null) => {
  return sequelize.query(`
    SELECT 
      bpi."id", bpi."idBillItem", b."name", b."satuanKemasan", bpit."hargaSatuan", 
      riq."quantityReceived", bpit.jumlah, b.cbm 
    FROM "BillPaymentItems"  as bpi
    INNER JOIN "BillPriceItem" as bpit ON bpi."idBillItem" = bpit."id" AND bpi."isDelete" = false
    INNER JOIN "ReceivedItemsQty" as riq ON bpit."idReceiveQtyItem" = riq."id" AND riq."isDelete" = false
    INNER JOIN "BarangPurchaseOrder" as bpo ON riq."idBarangPo" = bpo."id" AND bpo."isDelete" = false
    LEFT OUTER JOIN "Barang" as b on bpo."idBarang" = b."id"
    WHERE bpi."idBillPayment" = ${idBillPayment} and bpi."isDelete" = false
  `);
};
module.exports = {
  ViewOne,
  ViewAllList,
  ViewList,
  ViewOneQuery,
  ViewItemQuery,
};
