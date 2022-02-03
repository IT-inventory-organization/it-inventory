const sequelize = require("../../configs/database");
const {
  ActivityUser,
  Description,
  StatsItem,
} = require("../../helper/Activity.interface");
const { UpdateDeliveryOrder } = require("../../helper/DeliveryOrder");
const {
  UpdateDeliveryOrderBarang,
  AddDeliveryOrderBarang,
  SoftDeleteDeliveryOrderBarang,
} = require("../../helper/DeliveryOrder/barang");
const {
  removeHistories,
  insertHistoryBarang,
} = require("../../helper/Histories/barang");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");
const {
  GetIdBarangFromSalesOrdeBarang,
} = require("../../helper/SalesOrder/barang");

const updateDeliveryOrder = async (req, res) => {
  let t;
  try {
    const { idDo } = req.params;
    const { DeliveryOrderBarang, ...restOfData } = req.body.DataToInput;

    t = await sequelize.transaction();

    const resultDO = await UpdateDeliveryOrder(req, idDo, restOfData, t);

    /**
     * * Remove All Quantity That been record for
     * * With Specific Condition
     **/
    await removeHistories(req, res, {
      sourceId: idDo,
      sourceType: ActivityUser.DeliveryOrder,
    });
    /**
     * * Used for saving a succcessful update
     * * and successful create. And used for delete
     * * every data that belongs IdDo but with
     * * some exception id
     */
    const exception = [];

    /**
     * * Update Let The System loop all DeliveryOrderBarang
     * * And Check For an Id, if id is exists it means it for update
     * * but if id is not exists or empty it mean for create
     */

    // Update
    for (const iterator of DeliveryOrderBarang) {
      /**
       * * it will skip if id didn`t exist
       * * or empty
       */
      if (!iterator.id || iterator.id == "") {
        continue;
      }

      iterator.idDo = idDo;

      /**
       * * separating Id from rest of data
       * * if not it can caused violation primary key (error)
       */
      const { id, ...restData } = iterator;

      const result = await UpdateDeliveryOrderBarang(req, id, restData, t);

      /**
       * * To Insert History Quantity, it need `idBarang`, and with the
       * * table for delivery order and sales order is in relation,
       * * it gonna find idBarang through idSOBarang from DeliveryOrderBarang
       * * from there we can find idBarang
       */
      const getId = await GetIdBarangFromSalesOrdeBarang(
        iterator.idSOBarang,
        t
      );

      await insertHistoryBarang(
        req,
        res,
        {
          desc: Description.MINUS,
          userId: req.currentUser,
          idBarang: getId.toJSON().idBarang,
          quantityItem: iterator.quantityReceived,
          sourceId: idDo,
          sourceType: ActivityUser.DeliveryOrder,
          status: StatsItem.DEC,
        },
        t
      );
      /**
       * * Save The Id For Later Use
       */
      exception.push(result[1][0].toJSON().id);
    }

    // Create
    for (const iterator of DeliveryOrderBarang) {
      if (iterator.id) {
        continue;
      }

      iterator.idDo = idDo;

      /**
       * * In Case if the check condition didn`t work
       */
      const { id, ...restData } = iterator;

      const result = await AddDeliveryOrderBarang(restData, t);

      const getId = await GetIdBarangFromSalesOrdeBarang(
        iterator.idSOBarang,
        t
      );

      await insertHistoryBarang(
        req,
        res,
        {
          desc: Description.MINUS,
          userId: req.currentUser,
          idBarang: getId.toJSON().idBarang,
          quantityItem: iterator.quantityReceived,
          sourceId: idDo,
          sourceType: ActivityUser.DeliveryOrder,
          status: StatsItem.DEC,
        },
        t
      );

      exception.push(result.id);
    }

    /**
     * * Delete The Data That Belong to idDo
     * * but with id Exception
     */
    await SoftDeleteDeliveryOrderBarang(req, idDo, exception, t);

    await t.commit();

    return successResponse(
      res,
      httpStatus.created,
      "Success Update Delivery Order"
    );
  } catch (error) {
    if (t) {
      await t.rollback();
    }
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Update Delivery Order"
    );
  }
};

module.exports = {
  updateDeliveryOrder,
};
