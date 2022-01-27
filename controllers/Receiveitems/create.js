const sequelize = require("../../configs/database");
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

      const result = await addQtyReceiveItem(res, iterator, t);

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
