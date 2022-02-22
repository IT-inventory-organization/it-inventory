const sequelize = require("../../configs/database");
const { ActivityUser } = require("../../helper/Activity.interface");
const { AddCashReceive } = require("../../helper/CashReceive");
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
const addCashReceive = async (req, res) => {
  let t;
  try {
    if (CheckPermissionInsert(req, res, ActivityUser.CashReceive) === false) {
      return errorResponse(res, httpStatus.unauthorized, "Unauthorized User");
    }
    t = await sequelize.transaction();
    const result = await AddCashReceive(req.body.DataToInput, t);
    if (req.currentRole !== "Owner") {
      await CreateActivityUser(
        {
          activity: "Create Cash Receive",
          sourceId: result.id,
          sourceType: ActivityUser.CashReceive,
          userId: req.currentUser,
        },
        t
      );
    }
    await t.commit();
    return successResponse(
      res,
      httpStatus.created,
      "Success Create Cash Receive"
    );
  } catch (error) {
    if (t) {
      await t.rollback();
    }
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Add Cash Receive"
    );
  }
};

module.exports = {
  addCashReceive,
};
