const { ActivityUser } = require("../../helper/Activity.interface");
const httpStatus = require("../../helper/Httplib");
const { deletePurchaseOrder } = require("../../helper/PurchaseOrder");
const { errorResponse, successResponse } = require("../../helper/Response");
const { CreateActivityUser } = require("../../helper/UserActivity");
const { CheckPermissionDelete } = require("../../middlewares/permission");

const deletePo = async (req, res) => {
  try {
    if (CheckPermissionDelete(req, res, ActivityUser.PurchaseOrder) === false) {
      return errorResponse(res, httpStatus.unauthorized, "Unauthorized User");
    }
    const { idPo } = req.params;

    await deletePurchaseOrder(req, res, idPo);

    if (req.currentRole !== "Owner") {
      await CreateActivityUser({
        activity: "Delete Purchase Order",
        sourceId: idPo,
        sourceType: ActivityUser.PurchaseOrder,
        userId: req.currentUser,
      });
    }
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
