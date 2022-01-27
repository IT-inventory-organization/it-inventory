const { Op } = require("sequelize");
const BarangPurchaseOrder = require("../../database/models/barangPurchaseOrder");
const httpStatus = require("../Httplib");
const { errorResponse } = require("../Response");

const createBarangPurchaseOrder = async (
  req,
  res,
  data,
  transaction = null
) => {
  try {
    return BarangPurchaseOrder.create(data, {
      transaction: transaction,
      returning: true,
    });
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Craete Purchase Order Items",
      error
    );
  }
};

const updateBarangPurchaseOrder = async (
  res,
  data,
  idPo,
  idBrPo,
  transaction = null
) => {
  try {
    return BarangPurchaseOrder.update(data, {
      where: {
        id: idBrPo,
        idPo: idPo,
        isDelete: false,
      },
      transaction: transaction,
      returning: true,
    });
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Update Purchase Order"
    );
  }
};

const softDeleteBarangPurchaeOrder = async (
  req,
  res,
  idPo,
  dataToRemove = []
) => {
  try {
    return BarangPurchaseOrder.update(
      {
        isDelete: true,
      },
      {
        where: {
          idPo: idPo,
          id: {
            [Op.notIn]: dataToRemove,
          },
        },
      }
    );
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Update Purchase Order"
    );
  }
};

module.exports = {
  createBarangPurchaseOrder,
  updateBarangPurchaseOrder,
  softDeleteBarangPurchaeOrder,
};
