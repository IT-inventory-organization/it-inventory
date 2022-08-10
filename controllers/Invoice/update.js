const e = require("express");
const sequelize = require("../../configs/database");
const { ActivityUser } = require("../../helper/Activity.interface");
const { UpdateStatusDeliveryOrderRepo } = require("../../helper/DeliveryOrder");
const httpStatus = require("../../helper/Httplib");
const {
  UpdateInvoice,
  UpdateStatusInvoiceRepo,
} = require("../../helper/Invoice");
const {
  UpdateDetailInvoice,
  AddDetailInvoice,
  SoftDeleteDetailInvoice,
} = require("../../helper/Invoice/detail");
const { successResponse, errorResponse } = require("../../helper/Response");
const { CreateActivityUser } = require("../../helper/UserActivity");
const { CheckPermissionUpdate } = require("../../middlewares/permission");

const updateInvoice = async (req, res) => {
  let t;
  try {
    if (CheckPermissionUpdate(req, res, ActivityUser.Invoice) === false) {
      return errorResponse(res, httpStatus.unauthorized, "Unauthorized User");
    }
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

    if (req.currentRole !== "Owner") {
      await CreateActivityUser(
        {
          activity: "Update Invoice",
          sourceId: idInv,
          sourceType: ActivityUser.Invoice,
          userId: req.currentUser,
        },
        t
      );
    }

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

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 */
const updateInvoiceStatusApprove = async (req, res) => {
  let t;
  try {
    if (req.currentRole !== "Owner") {
      return errorResponse(res, httpStatus.unauthorized, "Access Not Granted");
    }

    if (!req.params.idInv) {
      return errorResponse(
        res,
        httpStatus.badRequest,
        "Invoice is Not Selected"
      );
    }

    t = await sequelize.transaction();

    await UpdateStatusInvoiceRepo(req.params.idInv, req.body.status, t);

    await t.commit();

    return successResponse(
      res,
      httpStatus.accepted,
      "Success Update Status Invoice"
    );
  } catch (error) {
    if (t) {
      t.rollback();
    }

    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Update Status Invoice"
    );
  }
};

module.exports = { updateInvoice, updateInvoiceStatusApprove };
