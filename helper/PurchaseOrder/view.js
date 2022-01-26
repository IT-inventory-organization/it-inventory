const BarangPurchaseOrder = require("../../database/models/barangPurchaseOrder");
const PurchaseOrder = require("../../database/models/purchaseOrder");
const httpStatus = require("../Httplib");
const { errorResponse } = require("../Response");

const ViewPurchaseOrder = async (req, res) => {
  try {
    return PurchaseOrder.findAll({
      where: {
        userId: req.currentUser,
        isDelete: false,
      },
      attributes: ["id", "nomorPO", "tanggal"],
      include: [
        {
          model: BarangPurchaseOrder,
          attributes: [],
          where: {
            isDelete: false,
          },
        },
      ],
    });
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch List Purchase Order"
    );
  }
};

const OnePurchaseOrder = async (req, res, idPo) => {
  try {
    return PurchaseOrder.findOne({
      where: {
        id: idPo,
        isDelete: false,
      },
      include: [
        {
          model: BarangPurchaseOrder,
          where: {
            isDelete: false,
          },
        },
      ],
    });
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch One List Purchase Order"
    );
  }
};

module.exports = {
  ViewPurchaseOrder,
  OnePurchaseOrder,
};
