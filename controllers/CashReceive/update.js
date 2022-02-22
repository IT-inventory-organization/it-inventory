const sequelize = require("../../configs/database");
const { ActivityUser } = require("../../helper/Activity.interface");
const { UpdateCashReceive } = require("../../helper/CashReceive");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");
const { CreateActivityUser } = require("../../helper/UserActivity");
const { CheckPermissionUpdate } = require("../../middlewares/permission");

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
const updateCashReceive = async (req, res) => {
  let t;
  try {
    if (CheckPermissionUpdate(req, res, ActivityUser.CashReceive) === false) {
      return errorResponse(res, httpStatus.unauthorized, "Unauthorized User");
    }
    const { idCashReceive } = req.params;

    t = await sequelize.transaction();

    const result = await UpdateCashReceive(
      idCashReceive,
      req.body.DataToInput,
      t
    );
    if (req.currentRole !== "Owner") {
      await CreateActivityUser(
        {
          activity: "Update Cash Receive",
          sourceId: idCashReceive,
          sourceType: ActivityUser.CashReceive,
          userId: req.currentUser,
        },
        t
      );
    }
    await t.commit();
    return successResponse(res, httpStatus.ok, "Success Update Cash Receive");
  } catch (error) {
    if (t) {
      await t.rollback();
    }
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Update Cash Receive"
    );
  }
};

module.exports = {
  updateCashReceive,
};
