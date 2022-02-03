const sequelize = require("../../configs/database");
const httpStatus = require("../../helper/Httplib");
const { AddInvoice } = require("../../helper/Invoice");
const { AddDetailInvoice } = require("../../helper/Invoice/detail");
const { errorResponse, successResponse } = require("../../helper/Response");

const addInvoice = async (req, res) => {
  let t;
  try {
    const { InvoiceDetail, ...restOfData } = req.body.DataToInput;

    t = await sequelize.transaction();

    const resultInv = await AddInvoice(restOfData, t);

    for (const iterator of InvoiceDetail) {
      iterator.idInv = resultInv.id;

      await AddDetailInvoice(iterator, t);
    }

    await t.commit();
    return successResponse(res, httpStatus.created, "Success Create Invoice");
  } catch (error) {
    console.log(error);
    if (t) {
      await t.rollback();
    }
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Create Invoice"
    );
  }
};

module.exports = {
  addInvoice,
};
