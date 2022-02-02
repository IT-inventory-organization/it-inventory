const { DeleteDeliveryOrder } = require("../../helper/DeliveryOrder/index");
const httpStatus = require("../../helper/Httplib");
const { successResponse } = require("../../helper/Response");

const deleteDeliveryOrder = async (req, res) => {
  try {
    const { idDo } = req.params;

    await DeleteDeliveryOrder(req, idDo);

    return successResponse(res, httpStatus.ok, "Success Delete Delivery Order");
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Delete Delivery Order"
    );
  }
};

module.exports = {
  deleteDeliveryOrder,
};
