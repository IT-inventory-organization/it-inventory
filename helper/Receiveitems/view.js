const Barang = require("../../database/models/barang");
const BarangPurchaseOrder = require("../../database/models/barangPurchaseOrder");
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
                  where: {
                    isDelete: false,
                  },
                },
              ],
            },
          ],
        },
      ],
      //   logging: console.log,
    });
  } catch (error) {
    console.log(error);
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To View Receive"
    );
  }
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
          attributes: ["quantityReceived"],
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
                  attributes: ["name"],
                  where: {
                    isDelete: false,
                  },
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
      ],
    });
  } catch (error) {
    console.log(error);
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch List Received Items"
    );
  }
};

module.exports = {
  viewOneReceive,
  listOfReceiveItem,
};
