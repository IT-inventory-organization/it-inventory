const httpStatus = require("../../helper/Httplib");
const { errorResponse } = require("../../helper/Response");

const addCashReceive = async (req, res) => {
  try {
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Add Cash Receive"
    );
  }
};
