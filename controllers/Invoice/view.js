const httpStatus = require("../../helper/Httplib");
const { ViewAllList, ViewOneList } = require("../../helper/Invoice/view");
const { errorResponse, successResponse } = require("../../helper/Response");

const ViewAll = async (req, res) => {
  try {
    const result = await ViewAllList(req);

    return successResponse(res, httpStatus.ok, "", result);
  } catch (error) {
    return errorResponse(res, httpStatus.internalServerError, "");
  }
};

const ViewOne = async (req, res) => {
  try {
    const { idInv } = req.params;

    const result = await ViewOneList(req, idInv);

    return successResponse(res, httpStatus.ok, "", result);
  } catch (error) {
    console.log(error);
    return errorResponse(res, httpStatus.internalServerError, "");
  }
};

module.exports = {
  ViewAll,
  ViewOne,
};
