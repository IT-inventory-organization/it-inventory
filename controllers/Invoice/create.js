const sequelize = require("../../configs/database");
const { ActivityUser } = require("../../helper/Activity.interface");
const { unauthorized } = require("../../helper/Httplib");
const httpStatus = require("../../helper/Httplib");
const { AddInvoice } = require("../../helper/Invoice");
const { AddDetailInvoice } = require("../../helper/Invoice/detail");
const { errorResponse, successResponse } = require("../../helper/Response");
const { CreateActivityUser } = require("../../helper/UserActivity");
const { CheckPermissionInsert } = require("../../middlewares/permission");

const addInvoice = async (req, res) => {
  let t;
  try {
    if (CheckPermissionInsert(req, res, ActivityUser.Invoice) === false) {
      return errorResponse(res, httpStatus.unauthorized, "Unauthorized User");
    }
    const { InvoiceDetail, ...restOfData } = req.body.DataToInput;

    t = await sequelize.transaction();

    const resultInv = await AddInvoice(restOfData, t);

    for (const iterator of InvoiceDetail) {
      iterator.idInv = resultInv.id;

      await AddDetailInvoice(iterator, t);
    }

    if (req.currentRole !== "Owner") {
      await CreateActivityUser(
        {
          activity: "Create Invoice",
          sourceId: resultInv.id,
          sourceType: ActivityUser.Invoice,
          userId: req.currentUser,
        },
        t
      );
    }
    await t.commit();
    return successResponse(res, httpStatus.created, "Success Create Invoice");
  } catch (error) {
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
