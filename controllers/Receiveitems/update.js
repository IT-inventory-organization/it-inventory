const sequelize = require("../../configs/database");
const httpStatus = require("../../helper/Httplib");
const { updateDataReceiveItem } = require("../../helper/Receiveitems");
const { errorResponse } = require("../../helper/Response");

const updateReceiveItem = async (req, res) => {
  let t;
  try {
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
  } catch (error) {
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
