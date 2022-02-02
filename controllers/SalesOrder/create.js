const sequelize = require("../../configs/database");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");
const { AddSalesOrder } = require("../../helper/SalesOrder");
const { AddSalesOrderBarang } = require("../../helper/SalesOrder/barang");

const addSalesOrder = async (req, res) => {
  let t;
  try {
    const { SalesOrderBarang, ...restOfData } = req.body.DataToInput;
    t = await sequelize.transaction();
    const result = await AddSalesOrder(res, restOfData, t);

    for (const iterator of SalesOrderBarang) {
      iterator.idSo = result.id;

      await AddSalesOrderBarang(res, iterator, t);
    }

    await t.commit();

    return successResponse(
      res,
      httpStatus.created,
      "Success Create Sales Order"
    );
  } catch (error) {
    if (t) {
      await t.rollback();
    }
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Add Sales Order"
    );
  }
};

module.exports = {
  addSalesOrder,
};
