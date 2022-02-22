const { ActivityUser } = require("../../helper/Activity.interface");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");
const { ViewOne } = require("../../helper/SaldoAwal/view");
const { CheckPermissionRead } = require("../../middlewares/permission");

module.exports = {
  viewOne: async (req, res) => {
    try {
      if (CheckPermissionRead(req, res, ActivityUser.SaldoAwal) === false) {
        return errorResponse(res, httpStatus.unauthorized, "Unauthorized User");
      }
      //   const { idSaldoAwal } = req.params;
      const result = await ViewOne(null);

      return successResponse(res, httpStatus.ok, "", result);
    } catch (error) {
      return errorResponse(res, httpStatus.internalServerError, "");
    }
  },
};
