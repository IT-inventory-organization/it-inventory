const e = require("express");
const { ActivityUser } = require("../../helper/Activity.interface");
const {
  ViewList,
  ViewOneList,
  ViewListNoDeliveryOrder,
  ViewListAutoComplete,
} = require("../../helper/DeliveryOrder/view");
const { FindDeliveryOrder } = require("../../helper/DeliveryOrder/viewOwner");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");
const { CheckPermissionRead } = require("../../middlewares/permission");

const FetchAllList = async (req, res) => {
  try {
    if (CheckPermissionRead(req, res, ActivityUser.DeliveryOrder) === false) {
      return errorResponse(res, httpStatus.unauthorized, "Unauthorized User");
    }
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

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns
 */
const FetchForOwner = async (req, res) => {
  try {
    if (req.currentRole !== "Owner") {
      return errorResponse(res, httpStatus.unauthorized, "Access Not Granted");
    }

    if (req.params.idDo) {
      const tHeOne = await FindDeliveryOrder(req.params.idDo);

      return successResponse(res, httpStatus.accepted, "", tHeOne);
    }

    const All = await FindDeliveryOrder();

    const Remap = {
      Accept: [],
      Reject: [],
      Pending: [],
    };

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
      "Failed To Fetch Delivery Order List"
    );
  }
};

module.exports = {
  FetchAllList,
  FetchOneList,
  FetchListOfNoDeliveryOrderThatNotBeenUsedYet,
  FetcOneDeliveryOrderAutoCompleteInvoice,
  FetchForOwner,
};
