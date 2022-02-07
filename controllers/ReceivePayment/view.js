const httpStatus = require("../../helper/Httplib");
const { ViewOne, ViewAll } = require("../../helper/ReceivePayment/view");
const { errorResponse, successResponse } = require("../../helper/Response");

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
      const res = await ViewAll(r);

      return successResponse(rs, httpStatus.ok, "", res);
    } catch (error) {
      return errorResponse(rs, httpStatus.internalServerError, "", error);
    }
  },
};
