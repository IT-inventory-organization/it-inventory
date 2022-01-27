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
          attributes: ["supplier", "id"],
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

module.exports = {
  viewOneReceive,
};
