const { ActivityUser } = require("../../helper/Activity.interface");
const httpStatus = require("../../helper/Httplib");
const {
  ViewAllList,
  ViewOneList,
  fetchInvoiceForRecievePaymentAutoComplete,
  fetchNoInvoiceForReceivePayment,
} = require("../../helper/Invoice/view");
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

module.exports = {
  ViewAll,
  ViewOne,
  fetchAllInvoiceThatNotBeenUsedYet,
  fetchInvoiceForAutoComplete,
};
