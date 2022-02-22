const sequelize = require("../../configs/database");
const { ActivityUser } = require("../../helper/Activity.interface");
const { UpdateBill } = require("../../helper/Bill");
const {
  UpdateBillPriceItem,
  AddBillPriceItem,
  SoftDelelteBillPriceItem,
} = require("../../helper/Bill/price");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");
const { CreateActivityUser } = require("../../helper/UserActivity");
const { CheckPermissionUpdate } = require("../../middlewares/permission");

const updateBill = async (req, res) => {
  let t;
  try {
    if (CheckPermissionUpdate(req, res, ActivityUser.Bill) === false) {
      return errorResponse(res, httpStatus.unauthorized, "Unauthorized User");
    }
    const { idBill } = req.params;
    const { BillPriceItem, ...restOfData } = req.body.DataToInput;
    t = await sequelize.transaction();

    const result = await UpdateBill(idBill, restOfData, t);

    const exception = [];
    /**
     * 1. Update
     */
    for (const iterator of BillPriceItem) {
      if (!iterator.id || iterator.id == "") {
        continue;
      }
      const { id, ...restOfBillPrice } = iterator;

      const resultBillPrice = await UpdateBillPriceItem(id, restOfBillPrice, t);

      exception.push(resultBillPrice[1][0].toJSON().id);
    }

    /**
     * 2. Create
     */
    for (const iterator of BillPriceItem) {
      if (iterator.id) {
        continue;
      }
      iterator.idBill = idBill;
      const { id, ...restOfBillPrice } = iterator;

      const resultBillPrice = await AddBillPriceItem(restOfBillPrice, t);

      exception.push(resultBillPrice.id);
    }

    /**
     * 3. Delete Data Belong To Id Bill
     * with Exception Id
     */
    await SoftDelelteBillPriceItem(idBill, exception, t);

    if (req.currentRole !== "Owner") {
      await CreateActivityUser(
        {
          activity: "Update Bill",
          sourceId: idBill,
          sourceType: ActivityUser.Bill,
          userId: req.currentUser,
        },
        t
      );
    }

    await t.commit();

    return successResponse(res, httpStatus.accepted, "Success Update Bill");
  } catch (error) {
    if (t) {
      await t.rollback();
    }
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Update Bill"
    );
  }
};

module.exports = {
  updateBill,
};
