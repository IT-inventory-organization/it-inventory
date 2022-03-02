const { ActivityUser } = require("../../helper/Activity.interface");
const { getBarang } = require("../../helper/Barang/view");
const httpStatus = require("../../helper/Httplib");
const {
  ViewPurchaseOrder,
  OnePurchaseOrder,
  listOfPurchaseOrder,
  fetchForReceiveItem,
} = require("../../helper/PurchaseOrder/view");
const { errorResponse, successResponse } = require("../../helper/Response");
const { CheckPermissionRead } = require("../../middlewares/permission");

const viewPurchaseOrder = async (req, res) => {
  try {
    if (CheckPermissionRead(req, res, ActivityUser.PurchaseOrder) === false) {
      return errorResponse(res, httpStatus.unauthorized, "Unauthorized User");
    }
    const resultList = await ViewPurchaseOrder(req, res);

    return successResponse(res, httpStatus.ok, "", resultList);
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch Purchase Order List"
    );
  }
};

const viewOnePurchaseOrder = async (req, res) => {
  try {
    const { idPo } = req.params;
    const result = await OnePurchaseOrder(req, res, idPo);

    return successResponse(res, httpStatus.ok, "", result);
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch One List Purchase Order"
    );
  }
};

const getAllBarang = async (req, res) => {
  try {
    const result = await getBarang(req, res);
    return successResponse(res, httpStatus.ok, "", result);
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Something's Wrong"
    );
  }
};

const listPurchaseOrderForReceiveItem = async (req, res) => {
  try {
    const { idReceive } = req.params;
    const result = await listOfPurchaseOrder(req, res);

    const listPurchaseOrderMap = result.map((x) => {
      const iterator = x.toJSON();

      if (iterator?.ReceiveItem?.id == idReceive || !iterator?.ReceiveItem) {
        return {
          nomorPO: iterator.nomorPO,
          id: iterator.id,
        };
      }
    });

    return successResponse(
      res,
      httpStatus.ok,
      "",
      listPurchaseOrderMap.filter((x) => x != null)
    );
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Ferhc List Of Purchase Order"
    );
  }
};

const fetchPoForReceiveItem = async (req, res) => {
  try {
    const { idPo } = req.params;
    const result = await fetchForReceiveItem(req, res, idPo);

    return successResponse(res, httpStatus.ok, "", result);
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed Fetching Po"
    );
  }
};

const listPurchaseOrderForSalesOrder = async (req, res) => {
  try {
    const { idSalesOrder } = req.params;
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed TO Fethc lIst Of Purchase Order"
    );
  }
};

module.exports = {
  viewPurchaseOrder,
  viewOnePurchaseOrder,
  getAllBarang,
  listPurchaseOrderForReceiveItem,
  fetchPoForReceiveItem,
};
