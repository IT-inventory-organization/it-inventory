const sequelize = require("../../configs/database");
const { ActivityUser } = require("../../helper/Activity.interface");
const { UpdateCashDisbursement } = require("../../helper/CashDisbursement");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");
const { CreateActivityUser } = require("../../helper/UserActivity");
const { CheckPermissionUpdate } = require("../../middlewares/permission");

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
const updateCashDisbursement = async (req, res) => {
  let t;
  try {
    if (
      CheckPermissionUpdate(req, res, ActivityUser.CashDisbursement) === false
    ) {
      return errorResponse(res, httpStatus.unauthorized, "Unauthorized User");
    }
    const { idCashDisbursement } = req.params;

    t = await sequelize.transaction();

    const result = await UpdateCashDisbursement(
      idCashDisbursement,
      req.body.DataToInput,
      t
    );
    if (req.currentRole !== "Owner") {
      await CreateActivityUser(
        {
          activity: "Update Cash Disbursement",
          sourceId: idCashDisbursement,
          sourceType: ActivityUser.CashDisbursement,
          userId: req.currentUser,
        },
        t
      );
    }

    await t.commit();
    return successResponse(
      res,
      httpStatus.ok,
      "Success Update Cash Disbursement"
    );
  } catch (error) {
    if (t) {
      await t.rollback();
    }
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Update Cash Disbursement"
    );
  }
};

module.exports = {
  updateCashDisbursement,
};
