const {
  ViewOneBill,
  ViewListOfBill,
  fetchNoTransaksiForBillPayment,
  fetchBillForBillPaymentAutoComplete,
} = require("../../helper/Bill/view");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");

const fetchOneBill = async (req, res) => {
  try {
    const { idBill } = req.params;
    const result = await ViewOneBill(req, idBill);

    return successResponse(res, httpStatus.ok, "", result);
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch Bill",
      error
    );
  }
};

const fetchAllBill = async (req, res) => {
  try {
    const result = await ViewListOfBill(req);

    return successResponse(res, httpStatus.ok, "", result);
  } catch (error) {
    return errorResponse(res, httpStatus.internalServerError, "", error);
  }
};

const fetchAllBillThatNotBeenUsedYet = async (req, res) => {
  try {
    const { idBillPayment } = req.params;

    const result = await fetchNoTransaksiForBillPayment(req);

    const BillTrancationMap = [];

    for (const iterator of result) {
      const json = iterator.toJSON();

      if (
        !iterator?.BillPayment ||
        iterator?.BillPayment?.id == idBillPayment
      ) {
        BillTrancationMap.push(json);
      }
    }

    return successResponse(res, httpStatus.ok, "", BillTrancationMap, false);
  } catch (error) {
    return errorResponse(res, httpStatus.internalServerError, "", error);
  }
};

const fetchBillFOrAutoComplete = async (req, res) => {
  try {
    const { idBill } = req.params;

    const result = await fetchBillForBillPaymentAutoComplete(req, idBill);

    return successResponse(res, httpStatus.ok, "", result);
  } catch (error) {
    console.log(error);
    return errorResponse(res, httpStatus.internalServerError, "", error);
  }
};

module.exports = {
  fetchOneBill,
  fetchAllBill,
  fetchAllBillThatNotBeenUsedYet,
  fetchBillFOrAutoComplete,
};
