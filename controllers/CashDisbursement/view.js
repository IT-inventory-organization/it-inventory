const { matchedData } = require("express-validator");
const { ActivityUser } = require("../../helper/Activity.interface");
const { ViewAll, ViewOne } = require("../../helper/CashDisbursement/view");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");
const { CheckPermissionRead } = require("../../middlewares/permission");

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
const viewAll = async (req, res) => {
  try {
    if (
      CheckPermissionRead(req, res, ActivityUser.CashDisbursement) === false
    ) {
      return errorResponse(res, httpStatus.unauthorized, "Unauthorized User");
    }
    const date = matchedData(req);

    if (Object.keys(date).length != 0) {
      if (!date?.startDate || !date?.endDate) {
        return errorResponse(
          res,
          httpStatus.badRequest,
          "To search base on date you must fill the two date field"
        );
      }
    }

    const initDate = {
      startDate: date.startDate,
      endDate: date.endDate,
    };
    const result = await ViewAll(initDate);

    return successResponse(res, httpStatus.ok, "", result);
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch Data"
    );
  }
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
const viewOne = async (req, res) => {
  try {
    const { idCashDisbursement } = req.params;

    const result = await ViewOne(idCashDisbursement);

    return successResponse(res, httpStatus.ok, "", result);
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Falied To Fetch Detail Cash Receive"
    );
  }
};

module.exports = {
  viewAll,
  viewOne,
};
