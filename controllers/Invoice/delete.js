const httpStatus = require("../../helper/Httplib");
const { DeleteInvoice } = require("../../helper/Invoice");
const { successResponse } = require("../../helper/Response");

const deleteInvoice = async (req, res) => {
  try {
    const { idInv } = req.params;

    await DeleteInvoice(req, idInv);

    return successResponse(res, httpStatus.accepted, "Success Delete Invoice");
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Delete Invoice"
    );
  }
};

module.exports = {
  deleteInvoice,
};
