const { ActivityUser } = require("../../helper/Activity.interface");
const httpStatus = require("../../helper/Httplib");
const { DeleteReceivePayment } = require("../../helper/ReceivePayment");
const { errorResponse, successResponse } = require("../../helper/Response");
const { CreateActivityUser } = require("../../helper/UserActivity");
const { CheckPermissionDelete } = require("../../middlewares/permission");

const deleteReceivePayment = async (req, rs) => {
  try {
    if (CheckPermissionDelete(req, rs, ActivityUser.ReceivePayment) === false) {
      return errorResponse(req, httpStatus.unauthorized, "Unauthorized User");
    }
    const { i } = req.params;

    await DeleteReceivePayment(req, i);

    if (req.currentRole !== "Owner") {
      await CreateActivityUser({
        activity: "Delete Receive Payment",
        sourceId: i,
        sourceType: ActivityUser.ReceivePayment,
        userId: req.currentUser,
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
