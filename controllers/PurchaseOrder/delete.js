const httpStatus = require("../../helper/Httplib");
const { deletePurchaseOrder } = require("../../helper/PurchaseOrder");
const { errorResponse, successResponse } = require("../../helper/Response");

const deletePo = async (req, res) => {
  try {
    const { idPo } = req.params;

    await deletePurchaseOrder(req, res, idPo);
    return successResponse(
      res,
      httpStatus.accepted,
      "Success Delete The Purchase Order"
    );
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Delete The Purchase Order"
    );
  }
};

module.exports = {
  deletePo,
};
