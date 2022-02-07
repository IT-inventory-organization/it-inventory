const sequelize = require("../../configs/database");
const httpStatus = require("../../helper/Httplib");
const { changeStatus } = require("../../helper/Invoice");
const { UpdateReceivePayment } = require("../../helper/ReceivePayment");
const {
  UpdateReceivePaymentDetail,
  AddReceivePaymentDetail,
  SoftDeleteReceivePaymentDetail,
} = require("../../helper/ReceivePayment/detail");
const { errorResponse, successResponse } = require("../../helper/Response");

const updateReceivePayment = async (r, rs) => {
  let t;
  try {
    const { i } = r.params;
    const { ReceivePaymentDetail, ...d } = r.body.DataToInput;

    t = await sequelize.transaction();

    const res = await UpdateReceivePayment(r, i, d, t);

    // const x = [];

    // Update
    // for (const iterator of ReceivePaymentDetail) {
    if (!ReceivePaymentDetail.id || ReceivePaymentDetail.id == "") {
      return errorResponse(
        rs,
        httpStatus.internalServerError,
        "Something`s Wrong"
      );
    }

    ReceivePaymentDetail.idReceivePayment = i;
    const { id, ...dd } = ReceivePaymentDetail;

    await UpdateReceivePaymentDetail(id, dd, t);

    const total =
      +ReceivePaymentDetail.jumlahTotal + +ReceivePaymentDetail.total;

    if (ReceivePaymentDetail.jumlah <= total) {
      await changeStatus(r, d.idInv, t);
    }

    await t.commit();

    return successResponse(
      rs,
      httpStatus.accepted,
      "Success Update Receive Payment"
    );
  } catch (error) {
    console.log(error);
    if (t) {
      await t.rollback();
    }

    return errorResponse(
      rs,
      httpStatus.internalServerError,
      "Failed To Update Receive Payment"
    );
  }
};

module.exports = {
  updateReceivePayment,
};
