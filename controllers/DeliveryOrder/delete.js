const { ActivityUser } = require("../../helper/Activity.interface");
const { DeleteDeliveryOrder } = require("../../helper/DeliveryOrder/index");
const httpStatus = require("../../helper/Httplib");
const { successResponse, errorResponse } = require("../../helper/Response");
const { CreateActivityUser } = require("../../helper/UserActivity");
const { CheckPermissionDelete } = require("../../middlewares/permission");

const deleteDeliveryOrder = async (req, res) => {
  try {
    if (CheckPermissionDelete(req, res, ActivityUser.DeliveryOrder) === false) {
      return errorResponse(res, httpStatus.unauthorized, "Unauthorized User");
    }
    const { idDo } = req.params;

    await DeleteDeliveryOrder(req, idDo);

    if (req.currentRole !== "Owner") {
      await CreateActivityUser({
        activity: "Delete Delivery Order",
        sourceId: idDo,
        sourceType: ActivityUser.DeliveryOrder,
        userId: req.currentUser,
      });
    }

    return successResponse(res, httpStatus.ok, "Success Delete Delivery Order");
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Delete Delivery Order"
    );
  }
};

module.exports = {
  deleteDeliveryOrder,
};
