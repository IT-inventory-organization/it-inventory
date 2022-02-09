const { matchedData } = require("express-validator");
const { addZero } = require("../../helper/convert");
const httpStatus = require("../../helper/Httplib");
const { ViewReportLedge } = require("../../helper/laporan");
const { errorResponse, successResponse } = require("../../helper/Response");
const authentication = require("../../middlewares/authentication");
const { VQueryDate } = require("../../middlewares/validateCashReceive");
const { validationResponse } = require("../../middlewares/validationResponse");

module.exports = (routes) => {
  routes.get(
    "/",
    authentication,
    VQueryDate,
    validationResponse,
    async (req, res) => {
      try {
        const date = matchedData(req);

        const restDate = new Date();
        const initialDate = `${restDate.getFullYear()}-${addZero(
          restDate.getMonth() + 1
        )}-${addZero(restDate.getDate())}`;

        const init = {
          startDate: date.startDate ? date.startDate : initialDate,
          endDate: date.endDate ? date.endDate : initialDate,
        };

        const result = await ViewReportLedge(init);

        return successResponse(res, httpStatus.ok, "", result[0]);
      } catch (error) {
        return errorResponse(res, httpStatus.internalServerError, "Failed");
      }
    }
  );
};
