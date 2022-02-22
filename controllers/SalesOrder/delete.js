const { ActivityUser } = require("../../helper/Activity.interface");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");
const { DeleteSalesOrder } = require("../../helper/SalesOrder");
const { CreateActivityUser } = require("../../helper/UserActivity");
const { CheckPermissionDelete } = require("../../middlewares/permission");

const deleteSalesOrder = async (req, res) => {
  try {
    if (CheckPermissionDelete(req, res, ActivityUser.SalesOrder) === false) {
      return errorResponse(res, httpStatus.unauthorized, "Unauthorized User");
    }
    const { idSo } = req.params;

    await DeleteSalesOrder(res, idSo);
    if (req.currentRole !== "Owner") {
      await CreateActivityUser({
        activity: "Delete Sales Order",
        sourceId: idSo,
        sourceType: ActivityUser.SalesOrder,
        userId: req.currentUser,
      });
    }
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
