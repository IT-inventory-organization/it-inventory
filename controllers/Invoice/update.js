const sequelize = require("../../configs/database");
const httpStatus = require("../../helper/Httplib");
const { UpdateInvoice } = require("../../helper/Invoice");
const {
  UpdateDetailInvoice,
  AddDetailInvoice,
  SoftDeleteDetailInvoice,
} = require("../../helper/Invoice/detail");
const { successResponse, errorResponse } = require("../../helper/Response");

const updateInvoice = async (req, res) => {
  let t;
  try {
    const { idInv } = req.params;
    const { InvoiceDetail, ...restOfData } = req.body.DataToInput;

    t = await sequelize.transaction();

    const resultInv = await UpdateInvoice(req, idInv, restOfData);

    const exception = [];

    // Update
    for (const iterator of InvoiceDetail) {
      if (!iterator.id || iterator.id == "") {
        continue;
      }

      iterator.idInv = idInv;

      const { id, ...restData } = iterator;
      const resultDetailInv = await UpdateDetailInvoice(req, id, restData, t);

      exception.push(resultDetailInv[1][0].toJSON().id);
    }

    // Create
    for (const iterator of InvoiceDetail) {
      if (iterator.id) {
        continue;
      }

      iterator.idInv = idInv;

      const { id, ...restData } = iterator;

      const resultUp = await AddDetailInvoice(restData, t);

      exception.push(resultUp.id);
    }

    await SoftDeleteDetailInvoice(idInv, exception, t);

    await t.commit();

    return successResponse(res, httpStatus.accepted, "Success Update Invoice");
  } catch (error) {
    if (t) {
      await t.rollback();
    }
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Update Invoice"
    );
  }
};

module.exports = { updateInvoice };
