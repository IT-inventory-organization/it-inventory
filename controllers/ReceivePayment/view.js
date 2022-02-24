const { ActivityUser } = require("../../helper/Activity.interface");
const httpStatus = require("../../helper/Httplib");
const { ViewOne, ViewAll } = require("../../helper/ReceivePayment/view");
const { errorResponse, successResponse } = require("../../helper/Response");
const { CheckPermissionRead } = require("../../middlewares/permission");

module.exports = {
  viewOne: async (r, rs) => {
    try {
      const { i } = r.params;
      const res = await ViewOne(r, i);

      return successResponse(rs, httpStatus.ok, "", res);
    } catch (error) {
      return errorResponse(rs, httpStatus.internalServerError, "", error);
    }
  },
  viewList: async (r, rs) => {
    try {
      if (CheckPermissionRead(r, rs, ActivityUser.ReceivePayment) === false) {
        return errorResponse(res, httpStatus.unauthorized, "Unauthorized User");
      }
      const res = await ViewAll(r);

      return successResponse(rs, httpStatus.ok, "", res);
    } catch (error) {
      return errorResponse(rs, httpStatus.internalServerError, "", error);
    }
  },
};
