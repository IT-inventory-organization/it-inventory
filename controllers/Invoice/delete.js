const { ActivityUser } = require("../../helper/Activity.interface");
const httpStatus = require("../../helper/Httplib");
const { DeleteInvoice } = require("../../helper/Invoice");
const { successResponse } = require("../../helper/Response");
const { CreateActivityUser } = require("../../helper/UserActivity");

const deleteInvoice = async (req, res) => {
  try {
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
