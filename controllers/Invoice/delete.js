const { ActivityUser } = require("../../helper/Activity.interface");
const httpStatus = require("../../helper/Httplib");
const { DeleteInvoice } = require("../../helper/Invoice");
const { successResponse, errorResponse } = require("../../helper/Response");
const { CreateActivityUser } = require("../../helper/UserActivity");
const { CheckPermissionDelete } = require("../../middlewares/permission");

const deleteInvoice = async (req, res) => {
  try {
    if (CheckPermissionDelete(req, res, ActivityUser.Invoice) === false) {
      return errorResponse(res, httpStatus.unauthorized, "Unauthorized User");
    }
    const { idInv } = req.params;

    await DeleteInvoice(req, idInv);

    if (req.currentRole !== "Owner") {
      await CreateActivityUser({
        activity: "Delete invoice",
        sourceId: idInv,
        sourceType: ActivityUser.Invoice,
        userId: req.currentUser,
      });
    }

    return successResponse(res, httpStatus.accepted, "Success Delete Invoice");
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Delete Invoice"
    );
  }
};

module.exports = {
  deleteInvoice,
};
