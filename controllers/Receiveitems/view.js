const httpStatus = require("../../helper/Httplib");
const {
  viewOneReceive,
  listOfReceiveItem,
} = require("../../helper/Receiveitems/view");
const { errorResponse, successResponse } = require("../../helper/Response");

const fetchReceiveItemForUpdate = async (req, res) => {
  try {
    const { idReceive } = req.params;
    const result = await viewOneReceive(req, res, idReceive);

    return successResponse(res, httpStatus.ok, "", result);
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch Receive Item"
    );
  }
};

const listReceiveItem = async (req, res) => {
  try {
    const result = await listOfReceiveItem(req, res);
    return successResponse(res, httpStatus.accepted, "", result);
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch List",
      error
    );
  }
};

module.exports = {
  fetchReceiveItemForUpdate,
  listReceiveItem,
};
