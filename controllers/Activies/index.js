const e = require("express");
const moment = require("moment");
const {
  ActivitiesDelivery,
  ActivityInvoice,
} = require("../../helper/Activity");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");
const authentication = require("../../middlewares/authentication");

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 */
const PreyingOnPeopleActivity = async (req, res) => {
  try {
    const A = await ActivitiesDelivery();
    const B = await ActivityInvoice();

    const P = [...A, ...B];

    const Sorted = P.sort(
      (a, b) =>
        moment(a.tanggalActivity).format("YYYYMMDD") -
        moment(b.tanggalActivity).format("YYYYMMDD")
    ).reverse();

    return successResponse(res, httpStatus.accepted, "", Sorted);
  } catch (error) {
    console.log(error);
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch Activities"
    );
  }
};

/**
 *
 * @param {e.Application} routes
 */
module.exports = (routes) => {
  routes.get("/", authentication, PreyingOnPeopleActivity);
};
