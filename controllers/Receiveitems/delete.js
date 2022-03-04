const { ActivityUser } = require("../../helper/Activity.interface");
const httpStatus = require("../../helper/Httplib");
const { deleteDataReceiveItem } = require("../../helper/Receiveitems");
const { errorResponse, successResponse } = require("../../helper/Response");
const { CreateActivityUser } = require("../../helper/UserActivity");
const { CheckPermissionDelete } = require("../../middlewares/permission");

const deleteReceiveItem = async (req, res) => {
  try {
    if (CheckPermissionDelete(req, res, ActivityUser.ReceiveItem) === false) {
      return errorResponse(res, httpStatus.unauthorized, "Unauthorized User");
    }
    const { idReceive } = req.params;
    await deleteDataReceiveItem(req, res, idReceive);

    // User Activity
    if (req.currentRole !== "Owner") {
      await CreateActivityUser({
        activity: "Delete Receive Items",
        sourceId: idReceive,
        sourceType: ActivityUser.ReceiveItem,
        userId: req.currentUser,
      });
    }
    return successResponse(
      res,
      httpStatus.accepted,
      "Success Delete Receive Item"
    );
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Delete Receive Item"
    );
  }
};

module.exports = {
  deleteReceiveItem,
};