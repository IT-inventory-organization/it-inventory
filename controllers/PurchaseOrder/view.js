const { getBarang } = require("../../helper/Barang/view");
const httpStatus = require("../../helper/Httplib");
const {
  ViewPurchaseOrder,
  OnePurchaseOrder,
  listOfPurchaseOrder,
  fetchForReceiveItem,
} = require("../../helper/PurchaseOrder/view");
const { errorResponse, successResponse } = require("../../helper/Response");

const viewPurchaseOrder = async (req, res) => {
  try {
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

const listPurchaseOrder = async (req, res) => {
  try {
    const result = await listOfPurchaseOrder(req, res);

    const listPurchaseOrderMap = result.map((x) => {
      const iterator = x.toJSON();
      console.log(iterator);
      if (iterator.id === req.params.idPo || !iterator?.ReceiveItem) {
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
      listPurchaseOrderMap.flat(),
      false
    );
  } catch (error) {
    console.log(error);
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

module.exports = {
  viewPurchaseOrder,
  viewOnePurchaseOrder,
  getAllBarang,
  listPurchaseOrder,
  fetchPoForReceiveItem,
};
