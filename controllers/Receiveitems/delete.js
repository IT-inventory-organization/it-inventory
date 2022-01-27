const httpStatus = require("../../helper/Httplib");
const { deleteDataReceiveItem } = require("../../helper/Receiveitems");
const { errorResponse, successResponse } = require("../../helper/Response");

const deleteReceiveItem = async (req, res) => {
  try {
    const { idReceive } = req.params;
    await deleteDataReceiveItem(req, res, idReceive);

    // User Activity
    return successResponse(
      res,
      httpStatus.accepted,
      "Success Delete Receive Item"
    );
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Delete Receive Item"
    );
  }
};

module.exports = {
  deleteReceiveItem,
};
