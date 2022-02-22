const sequelize = require("../../configs/database");
const { ActivityUser } = require("../../helper/Activity.interface");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");
const { DeleteSaldoAwal, AddSaldoAwal } = require("../../helper/SaldoAwal");
const { ViewOne } = require("../../helper/SaldoAwal/view");
const { CreateActivityUser } = require("../../helper/UserActivity");
const { CheckPermissionRead } = require("../../middlewares/permission");

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
const addSaldoAwal = async (req, res) => {
  let t;
  try {
    if (CheckPermissionRead(req, res, ActivityUser.SaldoAwal) === false) {
      return errorResponse(res, httpStatus.unauthorized, "Unauthorized User");
    }
    t = await sequelize.transaction();
    await DeleteSaldoAwal(t);

    const result = await AddSaldoAwal(req.body.DataToInput, t);

    if (req.currentRole !== "Owner") {
      await CreateActivityUser(
        {
          activity: "Create New Saldo Awal",
          sourceId: result.id,
          sourceType: ActivityUser.SaldoAwal,
          userId: req.currentUser,
        },
        t
      );
    }

    await t.commit();

    return successResponse(
      res,
      httpStatus.created,
      "Success Created Saldo Awal"
    );
  } catch (error) {
    if (t) {
      await t.rollback();
    }
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Create Saldo Awal"
    );
  }
};

module.exports = {
  addSaldoAwal,
};
