const sequelize = require("../../configs/database");
const {
  Description,
  ActivityUser,
  StatsItem,
} = require("../../helper/Activity.interface");
const { AddDeliveryOrder } = require("../../helper/DeliveryOrder");
const { AddDeliveryOrderBarang } = require("../../helper/DeliveryOrder/barang");
const { insertHistoryBarang } = require("../../helper/Histories/barang");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");
const {
  GetIdBarangFromSalesOrdeBarang,
} = require("../../helper/SalesOrder/barang");
const { CreateActivityUser } = require("../../helper/UserActivity");
const { CheckPermissionInsert } = require("../../middlewares/permission");

const addDeliveryOrder = async (req, res) => {
  let t;
  try {
    if (CheckPermissionInsert(req, res, ActivityUser.DeliveryOrder) === false) {
      return errorResponse(res, httpStatus.unauthorized, "Unauthorized User");
    }
    const { DeliveryOrderBarang, ...restOfData } = req.body.DataToInput;

    t = await sequelize.transaction();

    const result = await AddDeliveryOrder(restOfData, t);

    for (const iterator of DeliveryOrderBarang) {
      iterator.idDo = result.id;

      await AddDeliveryOrderBarang(iterator, t);
      const getId = await GetIdBarangFromSalesOrdeBarang(
        iterator.idSOBarang,
        t
      );

      await insertHistoryBarang(req, res, {
        userId: req.currentUser,
        desc: Description.MINUS,
        quantityItem: iterator.quantityReceived,
        sourceId: iterator.idDo,
        sourceType: ActivityUser.DeliveryOrder,
        status: StatsItem.DEC,
        idBarang: getId.toJSON().idBarang,
      });
    }

    if (req.currentRole !== "Owner") {
      await CreateActivityUser(
        {
          activity: "Create Delivery Order",
          sourceId: result.id,
          sourceType: ActivityUser.DeliveryOrder,
          userId: req.currentUser,
        },
        t
      );
    }

    await t.commit();

    return successResponse(
      res,
      httpStatus.created,
      "Success Create Delivery Order"
    );
  } catch (error) {
    if (t) {
      await t.rollback();
    }
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Falied To Create Delivery Order"
    );
  }
};

module.exports = {
  addDeliveryOrder,
};
