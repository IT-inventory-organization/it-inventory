const { ViewList, ViewOneList } = require("../../helper/DeliveryOrder/view");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");

const FetchAllList = async (req, res) => {
  try {
    const result = await ViewList(req);

    return successResponse(res, httpStatus.ok, "", result);
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch list Delivery Order"
    );
  }
};

const FetchOneList = async (req, res) => {
  try {
    const { idDo } = req.params;

    const result = await ViewOneList(req, idDo);

    return successResponse(res, httpStatus.ok, "", result);
  } catch (error) {
    console.log(error);
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch One Delivery Order"
    );
  }
};

module.exports = {
  FetchAllList,
  FetchOneList,
};
