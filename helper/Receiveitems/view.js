const Barang = require("../../database/models/barang");
const BarangPurchaseOrder = require("../../database/models/barangPurchaseOrder");
const Bill = require("../../database/models/bill");
const CardList = require("../../database/models/cardList");
const PurchaseOrder = require("../../database/models/purchaseOrder");
const ReceiveItems = require("../../database/models/receivedItems");
const ReceivedItemsQty = require("../../database/models/receivedItemsQty");
const httpStatus = require("../Httplib");
const { errorResponse } = require("../Response");

const viewOneReceive = async (req, res, idReceive, isUpdate = false) => {
  try {
    return ReceiveItems.findOne({
      where: {
        id: idReceive,
        isDelete: false,
        userId: req.currentUser,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId", "isDelete"],
      },
      include: [
        {
          model: PurchaseOrder,
          where: {
            isDelete: false,
          },
          attributes: ["supplier", "id", "nomorPO"],
          include: [
            {
              model: BarangPurchaseOrder,
              where: {
                isDelete: false,
              },
              attributes: [],
            },
          ],
        },
        {
          model: ReceivedItemsQty,
          where: {
            isDelete: false,
          },
          attributes: {
            exclude: ["createdAt", "updatedAt", "isDelete"],
          },
          include: [
            {
              model: BarangPurchaseOrder,
              where: {
                isDelete: false,
              },
              attributes: {
                exclude: ["createdAt", "updatedAt", "isDelete"],
              },
              include: [
                {
                  model: Barang,
                  attributes: ["satuanKemasan", "name"],
                },
              ],
            },
          ],
        },
      ],
    });
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To View Receive"
    );
  }
};

const ViewOneReceivedItemForBill = async (req, res, idReceive) => {
  return ReceiveItems.findOne({
    where: {
      userId: req.currentUser,
      isDelete: false,
      id: idReceive,
    },
    attributes: {
      exclude: ["createdAt", "updatedAt", "isDelete", "userId"],
    },
    include: [
      {
        model: PurchaseOrder,
        required: true,
        where: {
          isDelete: false,
        },
        attributes: ["supplier", "id"],
        include: [
          {
            model: BarangPurchaseOrder,
            attributes: ["quantity"],
            required: true,
          },
          {
            model: CardList,
            attributes: ["name"],
            where: {
              isDelete: false,
            },
            required: false,
          },
        ],
      },
      {
        model: ReceivedItemsQty,
        attributes: [["id", "idReceiveQtyItem"], "quantityReceived"],
        required: true, // Memastikan Data Sudah di isi semua
        where: { isDelete: false },
        include: [
          {
            model: BarangPurchaseOrder,
            attributes: ["hargaSatuan", "quantity"],
            include: [
              {
                model: Barang,
                attributes: ["name", "satuanKemasan"],
              },
            ],
          },
        ],
      },
    ],
  });
};

const listOfReceiveItem = async (req, res) => {
  try {
    return ReceiveItems.findAll({
      where: {
        userId: req.currentUser,
        isDelete: false,
      },
      attributes: ["id", "noReceive", "tanggal"],
      include: [
        {
          model: ReceivedItemsQty,
          // limit: 1,
          where: {
            isDelete: false,
          },
          attributes: ["quantityReceived", "id", "idBarangPo"],
          required: true,
          include: [
            {
              model: BarangPurchaseOrder,
              attributes: ["quantity", "hargaSatuan"],
              where: {
                isDelete: false,
              },
              required: true,
              include: [
                {
                  model: Barang,
                  attributes: ["name"],
                  required: true,
                },
              ],
            },
          ],
        },
        {
          model: PurchaseOrder,
          attributes: ["nomorPO"],
          where: {
            isDelete: false,
          },
          required: true,
          include: [
            {
              model: BarangPurchaseOrder,
              where: {
                isDelete: false,
              },
              attributes: [],
              required: true,
            },
          ],
        },
      ],
    });
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch List Received Items"
    );
  }
};

const viewListNoReceive = async (req, res, transaction = null) => {
  return ReceiveItems.findAll({
    where: {
      userId: req.currentUser,
      isDelete: false,
    },
    include: [
      {
        model: Bill,
        required: false,
        where: {
          isDelete: false,
        },
      },
    ],
    attributes: ["noReceive", "id"],
    transaction: transaction,
  });
};

module.exports = {
  viewOneReceive,
  listOfReceiveItem,
  viewListNoReceive,
  ViewOneReceivedItemForBill,
};
