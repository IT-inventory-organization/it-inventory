const { Op } = require("sequelize");
const ReceivedItemsQty = require("../../database/models/receivedItemsQty");
const httpStatus = require("../Httplib");
const { errorResponse } = require("../Response");

const addQtyReceiveItem = async (res, data, transaction = null) => {
  try {
    return ReceivedItemsQty.create(data, {
      transaction: transaction,
      returning: true,
    });
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Create Qty For Receive Item"
    );
  }
};

const updateQtyReceiveItem = async (res, idRcQty, data, transaction = null) => {
  try {
    return ReceivedItemsQty.update(data, {
      where: {
        id: idRcQty,
      },
      transaction: transaction,
      returning: true,
    });
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Update Qty Receive Item"
    );
  }
};

const softDeleteQtyReceiveItem = async (
  res,
  idReceive,
  exception = [],
  transaction = null
) => {
  try {
    return ReceivedItemsQty.update(
      {
        isDelete: true,
      },
      {
        where: {
          id: {
            [Op.notIn]: exception,
          },
          idReceive: idReceive,
        },
        transaction: transaction,
        returning: true,
      }
    );
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Update Qty Receive Item"
    );
  }
};

module.exports = {
  addQtyReceiveItem,
  updateQtyReceiveItem,
  softDeleteQtyReceiveItem,
};
