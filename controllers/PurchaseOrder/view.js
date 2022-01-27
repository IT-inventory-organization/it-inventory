const { Op } = require("sequelize");
const Barang = require("../../database/models/barang");
const {
  getBarangBaseNoPurchaseOrder,
  getBarang,
} = require("../../helper/Barang/view");
const httpStatus = require("../../helper/Httplib");
const {
  ViewPurchaseOrder,
  OnePurchaseOrder,
} = require("../../helper/PurchaseOrder/view");
const { errorResponse, successResponse } = require("../../helper/Response");

const viewPurchaseOrder = async (req, res) => {
  try {
    const resultList = await ViewPurchaseOrder(req, res);

    return successResponse(res, httpStatus.ok, "", resultList);
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch Purchase Order List"
    );
  }
};

const viewOnePurchaseOrder = async (req, res) => {
  try {
    const { idPo } = req.params;
    const result = await OnePurchaseOrder(req, res, idPo);
    return successResponse(res, httpStatus.ok, "", result);
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch One List Purchase Order"
    );
  }
};

const getAllBarang = async (req, res) => {
  try {
    const result = await getBarang(req, res);
    return successResponse(res, httpStatus.ok, "", result);
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Something's Wrong"
    );
  }
};

module.exports = {
  viewPurchaseOrder,
  viewOnePurchaseOrder,
  getAllBarang,
};
