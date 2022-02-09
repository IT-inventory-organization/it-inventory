const { ActivityUser } = require("../../helper/Activity.interface");
const { DeleteBillPayment } = require("../../helper/BillPayment");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");

const deleteBillPayment = async (req, res) => {
  try {
    const { idBillPayment } = req.params;

    await DeleteBillPayment(req, idBillPayment);

    if (req.currentRole !== "Owner") {
      await CreateActivityUser({
        activity: "Delete Bill Payment",
        sourceId: idBillPayment,
        sourceType: ActivityUser.BillPayment,
        userId: req.currentUser,
      });
    }
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
