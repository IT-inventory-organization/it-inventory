const e = require("express");
const { ActivityUser } = require("../../helper/Activity.interface");
const httpStatus = require("../../helper/Httplib");
const {
  ViewAllList,
  ViewOneList,
  fetchInvoiceForRecievePaymentAutoComplete,
  fetchNoInvoiceForReceivePayment,
} = require("../../helper/Invoice/view");
const { FindInvoiceWithABoss } = require("../../helper/Invoice/viewOwner");
const { errorResponse, successResponse } = require("../../helper/Response");
const { CheckPermissionRead } = require("../../middlewares/permission");

const ViewAll = async (req, res) => {
  try {
    if (CheckPermissionRead(req, res, ActivityUser.Invoice) === false) {
      return errorResponse(res, httpStatus.unauthorized, "Unauthorized User");
    }
    const result = await ViewAllList(req);

    return successResponse(res, httpStatus.ok, "", result);
  } catch (error) {
    return errorResponse(res, httpStatus.internalServerError, "");
  }
};

const ViewOne = async (req, res) => {
  try {
    const { idInv } = req.params;

    const result = await ViewOneList(req, idInv);

    return successResponse(res, httpStatus.ok, "", result);
  } catch (error) {
    return errorResponse(res, httpStatus.internalServerError, "");
  }
};

const fetchAllInvoiceThatNotBeenUsedYet = async (req, res) => {
  try {
    const { idReceivePayment } = req.params;

    const result = await fetchNoInvoiceForReceivePayment(req);

    const ReceiveTrancationMap = [];

    for (const iterator of result) {
      const json = iterator.toJSON();
      if (
        !json?.ReceivePayment ||
        json?.ReceivePayment?.id == idReceivePayment
      ) {
        ReceiveTrancationMap.push(json);
      }
    }

    return successResponse(res, httpStatus.ok, "", ReceiveTrancationMap);
  } catch (error) {
    return errorResponse(res, httpStatus.internalServerError, "", error);
  }
};

const fetchInvoiceForAutoComplete = async (req, res) => {
  try {
    const { idInv } = req.params;

    const result = await fetchInvoiceForRecievePaymentAutoComplete(req, idInv);

    const json = result.toJSON();
    let total = 0;

    for (const iterator of json.InvoiceDetails) {
      total += +iterator.DeliveryOrderBarang.SalesOrderBarang.jumlah;
    }
    json.total = total;
    return successResponse(res, httpStatus.ok, "", json);
  } catch (error) {
    return errorResponse(res, httpStatus.internalServerError, "", error);
  }
};

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 */
const FetchingWithBoss = async (req, res) => {
  try {
    if (req.currentRole !== "Owner") {
      return errorResponse(res, httpStatus.unauthorized, "Access Not Granted");
    }

    if (req.params.idInv) {
      const one = await FindInvoiceWithABoss(req.params.idInv);

      return successResponse(res, httpStatus.accepted, "", one, false);
    }

    const Remap = {
      Accept: [],
      Reject: [],
      Pending: [],
    };

    const All = await FindInvoiceWithABoss();

    for (const iterator of All) {
      switch (iterator.approve) {
        case true:
          Remap.Accept.push(iterator);
          break;
        case false:
          Remap.Reject.push(iterator);
          break;
        default:
          Remap.Pending.push(iterator);
          break;
      }
    }

    return successResponse(
      res,
      httpStatus.accepted,
      "",
      Object.entries(Remap).map((x) => ({
        name: x[0],
        payload: x[1],
        length: x[1].length,
      }))
    );
  } catch (error) {
    console.log(error);
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch Some Invoice"
    );
  }
};

module.exports = {
  ViewAll,
  ViewOne,
  fetchAllInvoiceThatNotBeenUsedYet,
  fetchInvoiceForAutoComplete,
  FetchingWithBoss,
};
