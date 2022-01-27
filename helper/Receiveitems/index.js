const ReceiveItems = require("../../database/models/receivedItems");
const httpStatus = require("../Httplib");
const { errorResponse } = require("../Response");

const addDataReceiveItem = async (res, data, transaction = null) => {
  try {
    return ReceiveItems.create(data, {
      transaction: transaction,
      returning: true,
    });
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Create Receive Item"
    );
  }
};

const deleteDataReceiveItem = async (req, res, idReceive) => {
  try {
    return ReceiveItems.update(
      {
        isDelete: true,
      },
      {
        where: {
          id: idReceive,
          userId: req.currentUser,
        },
        returning: true,
      }
    );
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Delete Receive Item Data"
    );
  }
};

const updateDataReceiveItem = async (
  req,
  res,
  data,
  idReceive,
  transaction = null
) => {
  try {
    return ReceiveItems.update(data, {
      where: {
        userId: req.currentUser,
        id: idReceive,
        isDelete: false,
      },
      transaction: transaction,
      returning: true,
    });
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Update Receive Item"
    );
  }
};

module.exports = {
  addDataReceiveItem,
  deleteDataReceiveItem,
  updateDataReceiveItem,
};
