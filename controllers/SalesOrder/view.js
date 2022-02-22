const { ActivityUser } = require("../../helper/Activity.interface");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");
const {
  ListSalesOrder,
  ViewOneSalesOrder,
  FetchListOfSalesOrder,
  FetchingDataForDeliveryOrder,
} = require("../../helper/SalesOrder/view");
const { CheckPermissionRead } = require("../../middlewares/permission");

const ViewListOfSalesOrder = async (req, res) => {
  try {
    if (CheckPermissionRead(req, res, ActivityUser.SalesOrder) === false) {
      return errorResponse(res, httpStatus.unauthorized, "Unauthorized User");
    }
    const result = await ListSalesOrder(req, res);

    return successResponse(
      res,
      httpStatus.ok,
      "Success Get List Of Sales Order",
      result
    );
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch List Sales Order"
    );
  }
};

const fetchOneSalesOrder = async (req, res) => {
  try {
    const { idSo } = req.params;

    const result = await ViewOneSalesOrder(req, idSo);

    return successResponse(
      res,
      httpStatus.ok,
      "Success Fetch One Sales Order",
      result
    );
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed to Fetch One Sales Order"
    );
  }
};

const ListOfSalesOrderThatNotBeenUsedYet = async (req, res) => {
  try {
    const { idDo } = req.params;
    const result = await FetchListOfSalesOrder(req);

    const ResultMap = [];

    for (const iterator of result) {
      const json = iterator.toJSON();
      //
      if (json?.DeliveryOrder?.id == idDo || !json?.DeliveryOrder) {
        ResultMap.push(json);
      }
    }

    return successResponse(res, httpStatus.ok, "", ResultMap);
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To List Of Sales Order"
    );
  }
};

const fetchDataForDeliveryOrderAutoComplete = async (req, res) => {
  try {
    const { idSo } = req.params;
    const result = await FetchingDataForDeliveryOrder(req, idSo);

    return successResponse(res, httpStatus.ok, "", result);
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch Data"
    );
  }
};

module.exports = {
  ViewListOfSalesOrder,
  fetchOneSalesOrder,
  ListOfSalesOrderThatNotBeenUsedYet,
  fetchDataForDeliveryOrderAutoComplete,
};
