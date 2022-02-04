const { DeleteBillPayment } = require("../../helper/BillPayment");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");

const deleteBillPayment = async (req, res) => {
  try {
    const { idBillPayment } = req.params;

    await DeleteBillPayment(req, idBillPayment);

    return successResponse(
      res,
      httpStatus.accepted,
      "Success Delete Bill Payment"
    );
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Delete Bill Payment"
    );
  }
};

module.exports = {
  deleteBillPayment,
};
