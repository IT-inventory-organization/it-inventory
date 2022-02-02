const { Op } = require("sequelize");
const SalesOrderBarang = require("../../database/models/salesOrderBarang");
const httpStatus = require("../Httplib");
const { errorResponse } = require("../Response");

const AddSalesOrderBarang = async (res, data, transaction = null) => {
  try {
    return SalesOrderBarang.create(data, {
      transaction: transaction,
      returning: true,
    });
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Add Sales Order Item"
    );
  }
};

const UpdateSalesOrderBarang = async (res, idSoBarang, data, transaction) => {
  try {
    return SalesOrderBarang.update(data, {
      where: {
        id: idSoBarang,
        isDelete: false,
      },
      transaction: transaction,
      returning: true,
    });
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed to Update Sales Order Item"
    );
  }
};

const SoftDeleteSalesOrderBarang = async (
  res,
  idSo,
  exception = [],
  transaction = null
) => {
  try {
    return SalesOrderBarang.update(
      {
        isDelete: true,
      },
      {
        where: {
          idSo: idSo,
          id: {
            [Op.notIn]: exception,
          },
        },
        transaction: transaction,
        returning: true,
      }
    );
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Update Sales Order Item"
    );
  }
};

const GetIdBarangFromSalesOrdeBarang = async (
  idSOBarang,
  transaction = null
) => {
  return SalesOrderBarang.findOne({
    where: {
      id: idSOBarang,
      isDelete: false,
    },
    attributes: ["idBarang"],
    transaction: transaction,
  });
};

module.exports = {
  AddSalesOrderBarang,
  UpdateSalesOrderBarang,
  SoftDeleteSalesOrderBarang,
  GetIdBarangFromSalesOrdeBarang,
};
