const e = require("express");
const {
  FoundUser,
  FoundRecent,
  FoundTotalBarang,
  FoundTotalDeliveryOrder,
  FoundTotalInvoice,
} = require("../../helper/A_Recent");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");
const authentication = require("../../middlewares/authentication");

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 */
const FindRecent = async (req, res) => {
  try {
    if (req.currentRole !== "Owner") {
      return errorResponse(res, httpStatus.unauthorized, "Access Not Granted");
    }

    const User = await FoundUser(req.currentUser);
    const CountBarang = await FoundTotalBarang();
    const CountDeliveryOrder = await FoundTotalDeliveryOrder();
    const CountInvoice = await FoundTotalInvoice();
    const Recent = await FoundRecent();

    const Payload = {
      User: User.toJSON(),
      CountBarang: CountBarang,
      CountDeliveryOrder: CountDeliveryOrder,
      CountTotalInvoice: CountInvoice,
      Recent: Recent,
    };

    return successResponse(res, httpStatus.accepted, "", Payload);
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch Dashboard"
    );
  }
};

/**
 *
 * @param {e.Application} routes
 */
module.exports = (routes) => {
  routes.get("/", authentication, FindRecent);
};
