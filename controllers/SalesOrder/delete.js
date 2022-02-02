const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");
const { DeleteSalesOrder } = require("../../helper/SalesOrder");

const deleteSalesOrder = async (req, res) => {
  try {
    const { idSo } = req.params;

    await DeleteSalesOrder(res, idSo);

    return successResponse(res, httpStatus.ok, "Success Dlete Sales Order");
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Delete Sales Order"
    );
  }
};

module.exports = {
  deleteSalesOrder,
};
