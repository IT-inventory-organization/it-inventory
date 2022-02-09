const { ActivityUser } = require("../../helper/Activity.interface");
const { DeleteCashReceive } = require("../../helper/CashReceive");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");
const { CreateActivityUser } = require("../../helper/UserActivity");

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
const deleteCashReceive = async (req, res) => {
  try {
    const { idCashReceive } = req.params;

    await DeleteCashReceive(idCashReceive);
    if (req.currentRole !== "Owner") {
      await CreateActivityUser({
        activity: "Delete Cash Receive",
        sourceId: idCashReceive,
        sourceType: ActivityUser.CashReceive,
        userId: req.currentUser,
      });
    }
    return successResponse(res, httpStatus.ok, "Success Delete Cash Receive");
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Delete Cash Receive"
    );
  }
};

module.exports = {
  deleteCashReceive,
};
