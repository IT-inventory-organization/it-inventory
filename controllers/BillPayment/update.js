const sequelize = require("../../configs/database");
const { ActivityUser } = require("../../helper/Activity.interface");
const { UpdateBillPayment } = require("../../helper/BillPayment");
const {
  UpdateBillPaymentItems,
  AddBillPaymentItems,
  SoftDeleteBillPaymentItems,
} = require("../../helper/BillPayment/barang");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");
const { CreateActivityUser } = require("../../helper/UserActivity");
const { CheckPermissionUpdate } = require("../../middlewares/permission");

const updateBillPaymentItem = async (req, res) => {
  let t;
  try {
    if (CheckPermissionUpdate(req, res, ActivityUser.BillPayment) === false) {
      return errorResponse(res, httpStatus.unauthorized, "Unauthorized User");
    }
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

    if (req.currentRole !== "Owner") {
      await CreateActivityUser(
        {
          activity: "Update Bill Payment",
          sourceId: idBillPayment,
          sourceType: ActivityUser.BillPayment,
          userId: req.currentUser,
        },
        t
      );
    }
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