const sequelize = require("../../configs/database");
const {
  Description,
  ActivityUser,
  StatsItem,
} = require("../../helper/Activity.interface");
const {
  insertHistoryBarang,
  removeHistories,
} = require("../../helper/Histories/barang");
const httpStatus = require("../../helper/Httplib");
const {
  getOneBarangPurchaseOrder,
} = require("../../helper/PurchaseOrder/barang");
const { updateDataReceiveItem } = require("../../helper/Receiveitems");
const {
  addQtyReceiveItem,
  updateQtyReceiveItem,
  softDeleteQtyReceiveItem,
} = require("../../helper/Receiveitems/quantity");
const { errorResponse, successResponse } = require("../../helper/Response");
const { CreateActivityUser } = require("../../helper/UserActivity");
const { CheckPermissionUpdate } = require("../../middlewares/permission");

const updateReceiveItem = async (req, res) => {
  let t;
  try {
    if (CheckPermissionUpdate(req, res, ActivityUser.ReceiveItem) === false) {
      return errorResponse(res, httpStatus.unauthorized, "Unauthorized User");
    }
    const { idReceive } = req.params;

    const { ReceivedItemsQty, ...restOfData } = req.body.DataToInput;
    t = await sequelize.transaction();
    const result = await updateDataReceiveItem(
      req,
      res,
      restOfData,
      idReceive,
      t
    );

    const exception = [];
    await removeHistories(
      req,
      res,
      { sourceId: idReceive, sourceType: ActivityUser.ReceiveItem },
      t
    );
    /**
     * 1. Create New
     */
    for (const iterator of ReceivedItemsQty) {
      if (iterator.id) {
        continue;
      }
      const { id, ...rest } = iterator;
      const result = await addQtyReceiveItem(res, rest, t);

      const resultBPo = await getOneBarangPurchaseOrder(rest.idBarangPo, t);

      await insertHistoryBarang(
        req,
        res,
        {
          userId: req.currentUser,
          desc: Description.ADD,
          idBarang: resultBPo.toJSON().idBarang,
          quantityItem: iterator.quantityReceived,
          sourceId: idReceive,
          sourceType: ActivityUser.ReceiveItem,
          status: StatsItem.INC,
        },
        t
      );

      exception.push(result.id);
    }

    // Update
    for (const iterator of ReceivedItemsQty) {
      if (!iterator.id) {
        continue;
      }

      const { id, ...rest } = iterator;
      const result = await updateQtyReceiveItem(res, id, rest, t);

      const resultBPo = await getOneBarangPurchaseOrder(rest.idBarangPo, t);

      await insertHistoryBarang(
        req,
        res,
        {
          userId: req.currentUser,
          desc: Description.ADD,
          idBarang: resultBPo.toJSON().idBarang,
          quantityItem: iterator.quantityReceived,
          sourceId: idReceive,
          sourceType: ActivityUser.ReceiveItem,
          status: StatsItem.INC,
        },
        t
      );

      exception.push(result[1][0].toJSON().id);
    }

    await softDeleteQtyReceiveItem(res, idReceive, exception, t);

    if (req.currentRole !== "Owner") {
      await CreateActivityUser(
        {
          activity: "Update Receive Items",
          sourceId: idReceive,
          sourceType: ActivityUser.ReceiveItem,
          userId: req.currentUser,
        },
        t
      );
    }
    await t.commit();

    return successResponse(
      res,
      httpStatus.created,
      "Success Update Receive Item"
    );
  } catch (error) {
    if (t) {
      await t.rollback();
    }
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Update Receive Item"
    );
  }
};

module.exports = {
  updateReceiveItem,
};