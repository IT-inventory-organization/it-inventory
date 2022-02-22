const sequelize = require("../../configs/database");
const { ActivityUser } = require("../../helper/Activity.interface");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");
const { UpdateSalesOrder, AddSalesOrder } = require("../../helper/SalesOrder");
const {
  UpdateSalesOrderBarang,
  SoftDeleteSalesOrderBarang,
  AddSalesOrderBarang,
} = require("../../helper/SalesOrder/barang");
const { CreateActivityUser } = require("../../helper/UserActivity");
const { CheckPermissionUpdate } = require("../../middlewares/permission");

const updateSalesOrder = async (req, res) => {
  let t;
  try {
    if (CheckPermissionUpdate(req, res, ActivityUser.SalesOrder) === false) {
      return errorResponse(res, httpStatus.unauthorized, "Unauthorized User");
    }
    const { idSo } = req.params;

    const { SalesOrderBarang, ...restOfData } = req.body.DataToInput;

    t = await sequelize.transaction();

    const result = await UpdateSalesOrder(req, res, idSo, restOfData, t);

    // Temporary Data For Exception Delete
    const exception = [];
    /**
     * * 1. Update Sales Order Barang
     */

    for (const iterator of SalesOrderBarang) {
      /**
       * * if it doesn`t have id, it mean create new Item
       * * so we skip those data
       */
      if (!iterator.id || iterator.id == "") {
        continue;
      }

      iterator.idSo = idSo;

      const { id, ...restSalesOrderBarang } = iterator;

      const resultUpdateSo = await UpdateSalesOrderBarang(
        res,
        id,
        restSalesOrderBarang,
        t
      );

      exception.push(resultUpdateSo[1][0].toJSON().id);
    }

    /**
     * * 2. Create New Sales Order Barang
     */
    for (const iterator of SalesOrderBarang) {
      /**
       * * a Data that have an id already used for update
       * * so we skip and find a data that doesn`t have an id
       */
      if (iterator.id) {
        continue;
      }

      iterator.idSo = idSo;

      const { id, ...restSalesOrderBarang } = iterator;

      const resultUpdateSo = await AddSalesOrderBarang(
        res,
        restSalesOrderBarang,
        t
      );

      exception.push(resultUpdateSo.id);
    }

    /**
     * * 3, Delete the Sales Order Barang that
     * * doesn`t include in exception variable
     */

    await SoftDeleteSalesOrderBarang(req, idSo, exception, t);

    if (req.currentRole !== "Owner") {
      await CreateActivityUser(
        {
          activity: "Update Sales Order",
          sourceId: idSo,
          sourceType: ActivityUser.SalesOrder,
          userId: req.currentUser,
        },
        t
      );
    }

    await t.commit();

    return successResponse(
      res,
      httpStatus.created,
      "Success Update Sales Order"
    );
  } catch (error) {
    if (t) {
      await t.rollback();
    }

    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Update Sales Order"
    );
  }
};

module.exports = {
  updateSalesOrder,
};
