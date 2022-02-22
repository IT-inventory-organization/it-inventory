const { ActivityUser } = require("../../helper/Activity.interface");
const httpStatus = require("../../helper/Httplib");
const {
  viewOneReceive,
  listOfReceiveItem,
  viewListNoReceive,
  ViewOneReceivedItemForBill,
} = require("../../helper/Receiveitems/view");
const { errorResponse, successResponse } = require("../../helper/Response");
const { CheckPermissionRead } = require("../../middlewares/permission");

const fetchReceiveItemForUpdate = async (req, res) => {
  try {
    const { idReceive } = req.params;
    const result = await viewOneReceive(req, res, idReceive);

    return successResponse(res, httpStatus.ok, "", result);
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch Receive Item"
    );
  }
};

const listReceiveItem = async (req, res) => {
  try {
    if (CheckPermissionRead(req, res, ActivityUser.ReceiveItem) === false) {
      return errorResponse(res, httpStatus.unauthorized, "Unauthorized User");
    }
    const result = await listOfReceiveItem(req, res);
    return successResponse(res, httpStatus.accepted, "", result);
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch List",
      error
    );
  }
};

const fetchListNoReceiveForBill = async (req, res) => {
  try {
    const { idBill } = req.params;
    const result = await viewListNoReceive(req, res);

    const RECEIVE_ITEMMAP = result.map((x) => {
      const iterator = x.toJSON();

      if (iterator?.Bill?.id === idBill || !iterator?.Bill) {
        return {
          noReceive: iterator.noReceive,
          id: iterator.id,
        };
      }
    });

    return successResponse(
      res,
      httpStatus.accepted,
      "",
      RECEIVE_ITEMMAP.filter((x) => x != null)
    );
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch No Receive"
    );
  }
};

const fetchOneDataOfReceiveItem = async (req, res) => {
  try {
    const { idReceive } = req.params;

    const result = await ViewOneReceivedItemForBill(req, res, idReceive);
    return successResponse(res, httpStatus.ok, "", result);
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch Data Of Receive Item"
    );
  }
};

module.exports = {
  fetchReceiveItemForUpdate,
  listReceiveItem,
  fetchListNoReceiveForBill,
  fetchOneDataOfReceiveItem,
};
