const { ActivityUser } = require("../../helper/Activity.interface");
const { DeleteCashDisbursement } = require("../../helper/CashDisbursement");
const { DeleteCashReceive } = require("../../helper/CashReceive");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");
const { CheckPermissionDelete } = require("../../middlewares/permission");

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
const deleteCashDisbursement = async (req, res) => {
  try {
    if (
      CheckPermissionDelete(req, rs, ActivityUser.CashDisbursement) === false
    ) {
      return errorResponse(res, httpStatus.unauthorized, "Unauthorized User");
    }
    const { idCashDisbursement } = req.params;

    await DeleteCashDisbursement(idCashDisbursement);

    if (req.currentRole !== "Owner") {
      await CreateActivityUser({
        activity: "De;ete Cash Disbursement",
        sourceId: idCashDisbursement,
        sourceType: ActivityUser.CashDisbursement,
        userId: req.currentUser,
      });
    }

    return successResponse(
      res,
      httpStatus.ok,
      "Success Delete Cash Disbursement"
    );
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Delete Cash Disbursement"
    );
  }
};

module.exports = {
  deleteCashDisbursement,
};