const httpStatus = require("../../helper/Httplib");
const { DeleteReceivePayment } = require("../../helper/ReceivePayment");
const { errorResponse, successResponse } = require("../../helper/Response");

const deleteReceivePayment = async (r, rs) => {
  try {
    const { i } = r.params;

    await DeleteReceivePayment(r, i);

    return successResponse(
      rs,
      httpStatus.accepted,
      "Success Delete Receive Report"
    );
  } catch (error) {
    return errorResponse(
      rs,
      httpStatus.internalServerError,
      "Falied Delete Receive Payment"
    );
  }
};

module.exports = {
  deleteReceivePayment,
};
