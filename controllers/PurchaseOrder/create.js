const sequelize = require("../../configs/database");
const httpStatus = require("../../helper/Httplib");
const { createPurchaseOrder } = require("../../helper/PurchaseOrder");
const {
  createBarangPurchaseOrder,
} = require("../../helper/PurchaseOrder/barang");
const { errorResponse, successResponse } = require("../../helper/Response");

const addPurchaseOrder = async (req, res) => {
  let transaction = null;
  try {
    const { BarangPo, ...data } = req.body.DataToInput;

    transaction = await sequelize.transaction();

    const result = await createPurchaseOrder(req, res, data, transaction);

    if (!result) {
      await transaction.rollback();
      return errorResponse(
        res,
        httpStatus.conflict,
        "Failed To Create New Purchase Order"
      );
    }

    const ResultItemMap = [];

    for (const iterator of BarangPo) {
      iterator.idPo = result.id;

      if (iterator.id) {
        delete iterator.id;
      }

      const resultItemPo = await createBarangPurchaseOrder(
        req,
        res,
        iterator,
        transaction
      );
      ResultItemMap.push(resultItemPo);
    }

    if (ResultItemMap.length !== BarangPo.length) {
      await transaction.rollback();
      return errorResponse(
        res,
        httpStatus.conflict,
        "Failed To Add Purchase Order Items"
      );
    }

    // Save Activity User
    await transaction.commit();
    return successResponse(
      res,
      httpStatus.created,
      "Success Creating New Purchase Order"
    );
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed Create Purchase Order"
    );
  }
};

module.exports = {
  addPurchaseOrder,
};
