const BarangPurchaseOrder = require("../../database/models/barangPurchaseOrder");
const httpStatus = require("../Httplib");
const { errorResponse } = require("../Response");

const createBarangPurchaseOrder = async (
  req,
  res,
  data,
  transaction = null
) => {
  try {
    return BarangPurchaseOrder.create(data, {
      transaction: transaction,
      returning: true,
    });
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Craete Purchase Order Items",
      error
    );
  }
};

const updateBarangPurchaseOrder = async (
  req,
  res,
  data,
  transaction = null
) => {
  try {
  } catch (error) {
    return errorResponse();
  }
};

module.exports = {
  createBarangPurchaseOrder,
};
