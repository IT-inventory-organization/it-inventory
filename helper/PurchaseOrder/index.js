const PurchaseOrder = require("../../database/models/purchaseOrder");
const httpStatus = require("../Httplib");
const { errorResponse } = require("../Response");

const createPurchaseOrder = async (req, res, data, transaction = null) => {
  try {
    return PurchaseOrder.create(data, {
      transaction: transaction,
      returning: true,
    });
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Save Purchase Order",
      error
    );
  }
};

const updatePurchaseOrder = async (
  req,
  res,
  data,
  idPo,
  transaction = null
) => {
  try {
    return PurchaseOrder.update(data, {
      where: {
        id: idPo,
      },
      transaction: transaction,
      returning: true,
    });
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Update Purchase Order",
      error
    );
  }
};

const deletePurchaseOrder = async (
  req,
  res,
  idPurchaseOrder,
  transaction = null
) => {
  try {
    return PurchaseOrder.update(
      { isDelete: true },
      {
        where: {
          id: idPurchaseOrder,
        },
        transaction: transaction,
        returning: true,
      }
    );
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Delete Purchase Order",
      error
    );
  }
};

module.exports = {
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
};
