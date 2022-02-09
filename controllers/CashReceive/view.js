const { matchedData } = require("express-validator");
const { ViewAll, ViewOne } = require("../../helper/CashReceive/view");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
const viewAll = async (req, res) => {
  try {
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
    const { idCashReceive } = req.params;

    const result = await ViewOne(idCashReceive);

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
