const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");
const { ViewOne } = require("../../helper/SaldoAwal/view");

module.exports = {
  viewOne: async (req, res) => {
    try {
      //   const { idSaldoAwal } = req.params;
      const result = await ViewOne(null);

      return successResponse(res, httpStatus.ok, "", result);
    } catch (error) {
      return errorResponse(res, httpStatus.internalServerError, "");
    }
  },
};
