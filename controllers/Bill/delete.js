const { ActivityUser } = require("../../helper/Activity.interface");
const { DeleteBill } = require("../../helper/Bill");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");
const { CreateActivityUser } = require("../../helper/UserActivity");
const { CheckPermissionDelete } = require("../../middlewares/permission");

const deleteBill = async (req, res) => {
  try {
    if (CheckPermissionDelete(req, res, ActivityUser.Bill) === false) {
      return errorResponse(res, httpStatus.unauthorized, "Unauthorized User");
    }
    const { idBill } = req.params;

    await DeleteBill(idBill);
    if (req.currentRole !== "Owner") {
      await CreateActivityUser({
        activity: "Delete Bill",
        sourceId: idBill,
        sourceType: ActivityUser.Bill,
        userId: req.currentUser,
      });
    }
    return successResponse(res, httpStatus.ok, "Success Delete Bill");
  } catch (error) {
    console.log(error);
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Delete Bill"
    );
  }
};

module.exports = {
  deleteBill,
};
