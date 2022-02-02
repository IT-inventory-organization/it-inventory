const SalesOrder = require("../../database/models/salesOrder");
const httpStatus = require("../Httplib");
const { errorResponse } = require("../Response");

const AddSalesOrder = async (res, data, transaction = null) => {
  try {
    return SalesOrder.create(data, {
      transaction: transaction,
      returning: true,
    });
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Add Sales Order"
    );
  }
};

const UpdateSalesOrder = async (req, res, idSo, data, transaction = null) => {
  try {
    return SalesOrder.update(data, {
      where: {
        id: idSo,
        isDelete: false,
        userId: req.currentUser,
      },
      transaction: transaction,
      returning: true,
    });
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Update Sales Order"
    );
  }
};

const DeleteSalesOrder = async (res, idSo, transaction = null) => {
  try {
    return SalesOrder.update(
      {
        isDelete: true,
      },
      {
        where: {
          id: idSo,
          isDelete: false,
        },
        transaction: transaction,
        returning: true,
      }
    );
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Delete Sales Order"
    );
  }
};

module.exports = {
  AddSalesOrder,
  UpdateSalesOrder,
  DeleteSalesOrder,
};
