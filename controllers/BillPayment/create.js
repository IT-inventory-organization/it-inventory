const sequelize = require("../../configs/database");
const { AddBillPayment } = require("../../helper/BillPayment");
const { AddBillPaymentItems } = require("../../helper/BillPayment/barang");
const { internalServerError } = require("../../helper/Httplib");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");

const addBillPayment = async (req, res) => {
  let t;
  try {
    const { BillPaymentItems, ...restOfData } = req.body.DataToInput;

    t = await sequelize.transaction();

    const resultBP = await AddBillPayment(restOfData, t);

    for (const iterator of BillPaymentItems) {
      iterator.idBillPayment = resultBP.id;

      await AddBillPaymentItems(iterator, t);
    }

    await t.commit();

    return successResponse(
      res,
      httpStatus.created,
      "Success Create Bill Payment"
    );
  } catch (error) {
    if (t) {
      await t.rollback();
    }
    return errorResponse(res, httpStatus.internalServerError, "", error);
  }
};

module.exports = { addBillPayment };
