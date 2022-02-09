const { ActivityUser } = require("../../helper/Activity.interface");
const httpStatus = require("../../helper/Httplib");
const { DeleteReceivePayment } = require("../../helper/ReceivePayment");
const { errorResponse, successResponse } = require("../../helper/Response");
const { CreateActivityUser } = require("../../helper/UserActivity");

const deleteReceivePayment = async (r, rs) => {
  try {
    const { i } = r.params;

    await DeleteReceivePayment(r, i);

    if (req.currentRole !== "Owner") {
      await CreateActivityUser({
        activity: "Delete Receive Payment",
        sourceId: i,
        sourceType: ActivityUser.ReceivePayment,
        userId: r.currentUser,
      });
    }

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
