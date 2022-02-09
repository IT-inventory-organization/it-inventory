const sequelize = require("../../configs/database");
const { ActivityUser } = require("../../helper/Activity.interface");
const { AddBillPayment } = require("../../helper/BillPayment");
const { AddBillPaymentItems } = require("../../helper/BillPayment/barang");
const { internalServerError } = require("../../helper/Httplib");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");
const { CreateActivityUser } = require("../../helper/UserActivity");

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
    if (req.currentRole !== "Owner") {
      await CreateActivityUser(
        {
          activity: "Create Bill Payment",
          sourceId: resultBP.id,
          sourceType: ActivityUser.BillPayment,
          userId: req.currentUser,
        },
        t
      );
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
