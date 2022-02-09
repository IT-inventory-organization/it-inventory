const {
  ViewList,
  ViewOneList,
  ViewListNoDeliveryOrder,
  ViewListAutoComplete,
} = require("../../helper/DeliveryOrder/view");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");

const FetchAllList = async (req, res) => {
  try {
    const result = await ViewList(req);

    const DOMap = [];

    for (const iterator of result) {
      const json = iterator.toJSON();
      let tmpQty = 0;

      for (const it of json.DeliveryOrderBarangs) {
        tmpQty += +it.quantityReceived;
      }

      DOMap.push({ ...json, quantity: tmpQty });
    }

    return successResponse(res, httpStatus.ok, "", DOMap);
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch list Delivery Order"
    );
  }
};

const FetchOneList = async (req, res) => {
  try {
    const { idDo } = req.params;

    const result = await ViewOneList(req, idDo);

    return successResponse(res, httpStatus.ok, "", result);
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch One Delivery Order"
    );
  }
};

const FetchListOfNoDeliveryOrderThatNotBeenUsedYet = async (req, res) => {
  try {
    const { idInv } = req.params;
    const result = await ViewListNoDeliveryOrder(req);

    const NoDoMap = [];

    for (const iterator of result) {
      const json = iterator.toJSON();

      if (json?.Invoice?.id == idInv || !iterator?.Invoice) {
        NoDoMap.push(json);
      }
    }

    return successResponse(res, httpStatus.ok, "", NoDoMap);
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch One Delivery Order"
    );
  }
};

const FetcOneDeliveryOrderAutoCompleteInvoice = async (req, res) => {
  try {
    const { idDo } = req.params;

    const result = await ViewListAutoComplete(req, idDo);

    return successResponse(res, httpStatus.ok, "", result);
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch One Delivery Order"
    );
  }
};

module.exports = {
  FetchAllList,
  FetchOneList,
  FetchListOfNoDeliveryOrderThatNotBeenUsedYet,
  FetcOneDeliveryOrderAutoCompleteInvoice,
};
