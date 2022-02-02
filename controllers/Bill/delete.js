const { DeleteBill } = require("../../helper/Bill");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");

const deleteBill = async (req, res) => {
  try {
    const { idBill } = req.params;

    await DeleteBill(idBill);

    return successResponse(res, httpStatus.ok, "Success Delete Bill");
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Delete Bill"
    );
  }
};

module.exports = {
  deleteBill,
};
