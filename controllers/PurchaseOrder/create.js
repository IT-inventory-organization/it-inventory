const sequelize = require("../../configs/database");
const { ActivityUser } = require("../../helper/Activity.interface");
const httpStatus = require("../../helper/Httplib");
const { createPurchaseOrder } = require("../../helper/PurchaseOrder");
const {
  createBarangPurchaseOrder,
} = require("../../helper/PurchaseOrder/barang");
const { errorResponse, successResponse } = require("../../helper/Response");
const { CreateActivityUser } = require("../../helper/UserActivity");
const { CheckPermissionInsert } = require("../../middlewares/permission");

const addPurchaseOrder = async (req, res) => {
  let transaction = null;
  try {
    if (CheckPermissionInsert(req, res, ActivityUser.PurchaseOrder) === false) {
      return errorResponse(res, httpStatus.unauthorized, "Unauthorized User");
    }
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

      if (iterator.id == '' || iterator.id) {
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
    if (req.currentRole !== "Owner") {
      await CreateActivityUser(
        {
          activity: "Create Purchase Order",
          sourceId: result.id,
          sourceType: ActivityUser.PurchaseOrder,
          userId: req.currentUser,
        },
        transaction
      );
    }
    await transaction.commit();
    return successResponse(
      res,
      httpStatus.created,
      "Success Creating New Purchase Order"
    );
  } catch (error) {
    // console.log(error);
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
