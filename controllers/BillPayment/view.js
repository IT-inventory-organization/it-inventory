const {
  ViewAllList,
  ViewList,
  ViewOne,
  ViewOneQuery,
  ViewItemQuery,
} = require("../../helper/BillPayment/view");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");

const viewAllList = async (req, res) => {
  try {
    const result = await ViewAllList(req);
    const ListMap = [];

    for (const iterator of result) {
      const json = iterator.toJSON();

      const items = await ViewList(json.id);

      ListMap.push({ ...json, BillPaymentItem: items[0] });
    }
    return successResponse(res, httpStatus.ok, "", ListMap);
  } catch (error) {
    return errorResponse(res, httpStatus.internalServerError, "");
  }
};

const viewOneList = async (req, res) => {
  try {
    const { idBillPayment } = req.params;
    let OneMap = {};

    const result = await ViewOneQuery(req, idBillPayment);
    const items = await ViewItemQuery(req, idBillPayment);

    OneMap = { ...result.toJSON(), BillPaymentItem: items[0] };

    return successResponse(res, httpStatus.ok, "", OneMap);
  } catch (error) {
    return errorResponse(res, httpStatus.internalServerError, "");
  }
};

module.exports = {
  viewAllList,
  viewOneList,
};
