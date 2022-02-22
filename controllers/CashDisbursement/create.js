const sequelize = require("../../configs/database");
const { ActivityUser } = require("../../helper/Activity.interface");
const { AddCashDisbursement } = require("../../helper/CashDisbursement");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");
const { CreateActivityUser } = require("../../helper/UserActivity");
const { CheckPermissionInsert } = require("../../middlewares/permission");

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Response}
 */
const addCashDisbursement = async (req, res) => {
  let t;
  try {
    if (
      CheckPermissionInsert(req, res, ActivityUser.CashDisbursement) === false
    ) {
      return errorResponse(res, httpStatus.unauthorized, "Unauthorized User");
    }
    t = await sequelize.transaction();
    const result = await AddCashDisbursement(req.body.DataToInput, t);

    if (req.currentRole !== "Owner") {
      await CreateActivityUser(
        {
          activity: "Create Cash Disbursement",
          sourceId: result.id,
          sourceType: ActivityUser.CashDisbursement,
          userId: req.currentUser,
        },
        t
      );
    }
    await t.commit();
    return successResponse(
      res,
      httpStatus.created,
      "Success Create Cash Disbursement"
    );
  } catch (error) {
    if (t) {
      await t.rollback();
    }
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Add Cash Disbursement"
    );
  }
};

module.exports = {
  addCashDisbursement,
};
