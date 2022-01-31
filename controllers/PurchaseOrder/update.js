const sequelize = require("../../configs/database");
const httpStatus = require("../../helper/Httplib");
const { updatePurchaseOrder } = require("../../helper/PurchaseOrder");
const {
  updateBarangPurchaseOrder,
  createBarangPurchaseOrder,
  softDeleteBarangPurchaeOrder,
} = require("../../helper/PurchaseOrder/barang");
const {
  checkExistingPo,
  OnePurchaseOrder,
} = require("../../helper/PurchaseOrder/view");
const { errorResponse, successResponse } = require("../../helper/Response");

// T0(2N)
const updatePo = async (req, res) => {
  let t;
  try {
    const { idPo } = req.params;

    t = await sequelize.transaction();

    await checkExistingPo(req, res, idPo);

    const { BarangPo, ...data } = req.body.DataToInput;

    const { id, ...restOfData } = data;

    await updatePurchaseOrder(req, res, restOfData, idPo, t);

    /**
     * * Temporary Data
     * * Simpan id Hasil Update dan Create
     * * digunakan untuk pengecualian penghapusan data
     * S0(N)
     */
    const ResultBrPoMap = [];

    // Update (T0(N))
    for (const iterator of BarangPo) {
      iterator.idPo = idPo;
      if (!iterator.id || iterator.id == "") {
        continue;
      }

      const { id, ...restOfDataBarang } = iterator;
      const resultBrPo = await updateBarangPurchaseOrder(
        res,
        restOfDataBarang,
        idPo,
        id,
        t
      );
      ResultBrPoMap.push(resultBrPo[1][0].toJSON().id);
    }

    // Create (T0(N))
    for (const iterator of BarangPo) {
      iterator.idPo = idPo;
      if (iterator.id) {
        continue;
      }
      const { id, ...restOfDataBarang } = iterator;
      const resultBrPo = await createBarangPurchaseOrder(
        req,
        res,
        restOfDataBarang,
        t
      );
      ResultBrPoMap.push(resultBrPo.id);
    }

    /**
     * * Menghapus Data Dengan Pengecualian
     * * Yang telah di simpan di Temporary Data
     */
    await softDeleteBarangPurchaeOrder(req, res, idPo, ResultBrPoMap);

    // User Activity

    await t.commit();

    return successResponse(
      res,
      httpStatus.accepted,
      "Sucess Update Purchase Order",
      ""
    );
  } catch (error) {
    console.log(error);
    if (t) {
      await t.rollback();
    }
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Update Purchase Order"
    );
  }
};

// const fetchPoForUpdate = async(req, res) => {
//   try {
//     const result = await OnePurchaseOrder()
//   } catch (error) {
//     return errorResponse(res, httpStatus.internalServerError, "Failed To Update Purchase Order");
//   }
// }

module.exports = {
  updatePo,
};
