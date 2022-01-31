const sequelize = require("../../configs/database");
const { CreateBill } = require("../../helper/Bill");
const { AddBillPriceItem } = require("../../helper/Bill/price");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");

const addBill = async (req, res) => {
  let t;
  try {
    const { BillPriceItem, ...restOfData } = req.body.DataToInput;
    t = await sequelize.transaction();
    const result = await CreateBill(res, restOfData, t);

    for (const iterator of BillPriceItem) {
      iterator.idBill = result.id;
      if (iterator.id) {
        delete iterator.id;
      }
      await AddBillPriceItem(iterator, t);
    }

    await t.commit();
    return successResponse(res, httpStatus.created, "Success Created Bill");
  } catch (error) {
    if (t) {
      await t.rollback();
    }
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed to create Bill",
      error
    );
  }
};

module.exports = {
  addBill,
};
