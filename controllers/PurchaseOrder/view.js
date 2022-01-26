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

module.exports = {
  viewPurchaseOrder,
  viewOnePurchaseOrder,
};
