const sequelize = require("../../configs/database");
const {
  Description,
  ActivityUser,
  StatsItem,
} = require("../../helper/Activity.interface");
const { insertHistoryBarang } = require("../../helper/Histories/barang");
const httpStatus = require("../../helper/Httplib");
const { addDataReceiveItem } = require("../../helper/Receiveitems");
const { addQtyReceiveItem } = require("../../helper/Receiveitems/quantity");
const { errorResponse, successResponse } = require("../../helper/Response");

const addReceiveItems = async (req, res) => {
  let t;
  try {
    t = await sequelize.transaction();

    const { ReceivedItemsQty, ...restOfData } = req.body.DataToInput;

    const resultReceive = await addDataReceiveItem(res, restOfData, t);

    const ResultQtyReceive = [];

    for (const iterator of ReceivedItemsQty) {
      iterator.idReceive = resultReceive.id;

      if (iterator.id) {
        delete iterator.id;
      }

      const result = await addQtyReceiveItem(res, iterator, t);

      await insertHistoryBarang(
        req,
        res,
        {
          userId: req.currentUser,
          idBarang: iterator.idBarangPo,
          desc: Description.MINUS,
          quantityItem: iterator.quantityReceived,
          sourceId: iterator.idReceive,
          sourceType: ActivityUser.ReceiveItem,
          status: StatsItem.DEC,
        },
        t
      );

      ResultQtyReceive.push(result.id);
    }

    // User Activity

    await t.commit();

    return successResponse(
      res,
      httpStatus.created,
      "Success Create New Receive Item"
    );
  } catch (error) {
    console.log(error);
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
