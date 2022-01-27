const httpStatus = require("../../helper/Httplib");
const { viewOneReceive } = require("../../helper/Receiveitems/view");
const { errorResponse, successResponse } = require("../../helper/Response");

const fetchReceiveItemForUpdate = async (req, res) => {
  try {
    const { idReceive } = req.params;
    const result = await viewOneReceive(req, res, idReceive);

    return successResponse(res, httpStatus.ok, "", result, false);
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch Receive Item"
    );
  }
};

module.exports = {
  fetchReceiveItemForUpdate,
};
