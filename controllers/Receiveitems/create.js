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
const { addDataReceiveItem } = require("../../helper/Receiveitems");
const { addQtyReceiveItem } = require("../../helper/Receiveitems/quantity");
const { errorResponse, successResponse } = require("../../helper/Response");
const { CreateActivityUser } = require("../../helper/UserActivity");

const addReceiveItems = async (req, res) => {
  let t;
  try {
    t = await sequelize.transaction();

    const { ReceivedItemsQty, ...restOfData } = req.body.DataToInput;

    const resultReceive = await addDataReceiveItem(res, restOfData, t);

    const ResultQtyReceive = [];

    /**
     * Membuang History Barang Receive Item
     */
    await removeHistories(
      req,
      res,
      {
        sourceId: resultReceive.id,
        sourceType: ActivityUser.ReceiveItem,
      },
      t
    );

    for (const iterator of ReceivedItemsQty) {
      iterator.idReceive = resultReceive.id;

      if (iterator.id) {
        delete iterator.id;
      }

      const result = await addQtyReceiveItem(res, iterator, t);
      const getId = await getOneBarangPurchaseOrder(iterator.idBarangPo, t);
      await insertHistoryBarang(
        req,
        res,
        {
          userId: req.currentUser,
          idBarang: getId.toJSON().idBarang,
          desc: Description.ADD,
          quantityItem: iterator.quantityReceived,
          sourceId: iterator.idReceive,
          sourceType: ActivityUser.ReceiveItem,
          status: StatsItem.INC,
        },
        t
      );

      ResultQtyReceive.push(result.id);
    }

    // User Activity
    if (req.currentRole !== "Owner") {
      await CreateActivityUser(
        {
          activity: "Create Receive Items",
          sourceId: resultReceive.id,
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
      "Success Create New Receive Item"
    );
  } catch (error) {
    if (t) {
      await t.rollback();
    }
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Create Received Items"
    );
  }
};

module.exports = {
  addReceiveItems,
};
