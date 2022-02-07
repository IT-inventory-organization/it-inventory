const sequelize = require("../../configs/database");
const { UpdateBillPayment } = require("../../helper/BillPayment");
const {
  UpdateBillPaymentItems,
  AddBillPaymentItems,
  SoftDeleteBillPaymentItems,
} = require("../../helper/BillPayment/barang");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");

const updateBillPaymentItem = async (req, res) => {
  let t;
  try {
    const { idBillPayment } = req.params;

    const { BillPaymentItems, ...restOfData } = req.body.DataToInput;

    t = await sequelize.transaction();

    const resultBP = await UpdateBillPayment(req, idBillPayment, restOfData, t);

    const exception = [];

    for (const iterator of BillPaymentItems) {
      if (!iterator.id || iterator.id == "") {
        continue;
      }

      iterator.idBillPayment = idBillPayment; // Belong To Bill Payment

      const { id, ...restData } = iterator;

      const resultItem = await UpdateBillPaymentItems(id, restData, t);

      exception.push(resultItem[1][0].toJSON().id);
    }

    for (const iterator of BillPaymentItems) {
      if (iterator.id) {
        continue;
      }

      iterator.idBillPayment = idBillPayment; // Belong To Bill Payment

      const { id, ...restData } = iterator;

      const resultItem = await AddBillPaymentItems(restData, t);

      exception.push(resultItem.id);
    }

    await SoftDeleteBillPaymentItems(idBillPayment, exception, t);

    await t.commit();

    return successResponse(
      res,
      httpStatus.accepted,
      "Success Update Bill Payment"
    );
  } catch (error) {
    if (t) {
      await t.rollback();
    }
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Update Bill Payment Item"
    );
  }
};

module.exports = {
  updateBillPaymentItem,
};
